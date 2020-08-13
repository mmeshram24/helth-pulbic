const express = require('express');
const isEmpty = require("../../utils/is-empty");
const UserController = require('../../controllers/user/user.controller');
const { User, Patient, Doctor } = require('../../models/user/user.model');
const mongodb = require("mongodb");
const response = require("../../utils/response");
// const moment = require('moment');
const router = express.Router();
const bcrypt = require("bcryptjs");
const authorizePrivilege = require("../../middleware/authorizationMiddleware");
const authMiddleware = require("../../middleware/authMiddleware")();
const { S3Upload, upload, IMG_DIR_CONSTS } = require("../../utils/image-upload");

const QUERY_CONST = {
    mobile_number: "Mobile number",
    email: "Email"
}
const ErrorFields = function (errors, result, u) {
    return errors.filter(e => ((String(u[e]) == String(result.data[e])) && ((String(u[e]) != "undefined") && (String(result.data[e]) != "undefined"))))
}
const errMsg = messageArray => messageArray.reduce((acc, current, index) => {
    if ((messageArray.length - 1) == index) {
        return acc += QUERY_CONST[current];
    } else {
        return acc += `${QUERY_CONST[current]} and `;
    }
}, "");


router.post("/update/me", authMiddleware, upload.single("profile_picture"), async (req, res) => {
    try {
        let Model = User;
        let result, userid = req.user._id,
            query, errors;
        switch (String(req.user.userType)) {
            case "patient":
                result = UserController.verifyPatientProfile(req.body);
                errors = ["mobile_number", " email"];
                query = {
                    $or: errors.filter(e => result.data[e]).map(e => ({
                        [e]: result.data[e]
                    })),
                    _id: { $ne: req.user._id }
                };
                Model = Patient;
                break;
            case "doctor":
                result = UserController.verifyDoctorProfile(req.body);
                errors = ["email", /*"mobile_number"*/];
                query = {
                    $or: errors.filter(e => result.data[e]).map(e => ({
                        [e]: result.data[e]
                    }))
                    // [{ email: result.data.email }, { mobile_number: result.data.mobile_number }]
                    ,
                    _id: { $ne: req.user._id }
                };
                Model = Doctor;
                break;
            case "admin":
                result = UserController.verifyAdminProfile(req.body);
                errors = ["email"];
                query = {
                    $or: errors.filter(e => result.data[e]).map(e => ({
                        [e]: result.data[e]
                    })),
                    _id: { $ne: req.user._id }
                };
                break;
            default:
                return response(res, 400, null, true, "You can't access this resource");
        }
        if (!isEmpty(result.errors))
            return response(res, 400, null, result.errors, "Fields required");
        let u = await User.findOne(query).lean();
        if (u) {
            return response(res, 400, null, true, `${errMsg(ErrorFields(errors, result, u))} is already in use by another user`);
        }
        if (req.file) {
            result.data.profile_picture = await S3Upload(IMG_DIR_CONSTS.PROFILE_PICTURE + `/${req.user._id}`, req.file);
        }
        let user = await Model
            .findByIdAndUpdate(userid, { $set: result.data }, { new: true }).populate([{ path: "languages" }, { path: "symptoms" }])
            .lean()
            .exec();
        delete user.password;
        response(res, 200, user, false, "Profile updated successfully");
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Error while updating pofile");
    }
})
router.get("/vendor/id/:id", async (req, res) => {
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid id" });
    }
    User.find({ _id: req.params.id, $or: [{ role: process.env.VENDOR_ROLE }, { role: process.env.ADMIN_ROLE }] }, "-password -bank")
        // .populate({ path: 'role', select: 'name' })
        .exec().then(allUsers => {
            return response(res, 200, allUsers, false, "All users");
        }).catch(err => {
            console.log(err);
            return response(res, 500, null, true, "Error while fetching users");
        })
})
// Get All Users
router.get("/", authMiddleware, async (req, res) => {
    try {
        const allUsers = await User.find({ _id: { $ne: req.user._id } }).populate({ path: 'role', select: 'name' }).exec();
        return response(res, 200, allUsers, false, "All users");
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Error while fetching users");
    }
})
// Get salesman
router.get("/doctor", authMiddleware, async (req, res) => {
    try {
        let query;
        switch (String(req.user.userType)) {
            case "patient":
                break;
            case "admin":
                // query = { role: process.env.SALES_MAN_ROLE, manager: req.user._id };
                break;
            default:
                return response(res, 400, null, true, "You can't access this resource");
        }
        query = { userType: "doctor" };
        let doctors = await User.aggregate([
            { $match: query },
            { $lookup: { from: "favourite_doctors", let: { id: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$doctor", "$$id"] }, user: mongodb.ObjectID(req.user._id) } }], as: "favourite" } },
            { $addFields: { favourite: { $gte: [{ $size: "$favourite" }, 1] } } },
            { $project: { password: 0 } }
        ]).exec();
        let docs = await Doctor.populate(doctors, "symptoms languages");
        return response(res, 200, docs, false, "All doctors");
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Error while fetching users");
    }
})

// Get All Customers USers
router.get("/patient", authMiddleware, async (req, res) => {
    try {
        let query;
        switch (String(req.user.userType)) {
            case "admin":
                query = { userType: "patient" };
                break;
            default:
                return response(res, 400, null, true, "You can't access this resource");
        }
        const allUsers = await User
            .find(query).lean()
            .exec();
        return res.json({ status: 200, message: "All patients", errors: false, data: allUsers });
    } catch (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
    }
})
router.delete('/:id', authMiddleware, authorizePrivilege("DELETE_USER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        User.deleteOne({ _id: req.params.id }, (err, user) => {
            if (err) throw err;
            res.send({ status: 200, errors: false, message: "User deleted successfully", data: user })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the user" });
        });
    } else {
        console.log("ID not Found")
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
    }
});

//Add customer
router.post("/add/customer", authMiddleware, authorizePrivilege("ADD_USER"), upload.single("profile_picture"), async (req, res) => {
    try {
        let result, query, errors;
        switch (String(req.user.role._id)) {
            case process.env.SALES_MAN_ROLE:
                result = UserController.verifyCustomerAddWebBySalesman(req.body);
                query = { mobile_number: result.data.mobile_number }
                errors = ["mobile_number"];
                break;
            case process.env.ADMIN_ROLE:
                result = UserController.verifyCustomerAddWebBySalesman(req.body);
                query = { mobile_number: result.data.mobile_number }
                errors = ["mobile_number"];
                break;
            default:
                return response(res, 400, null, true, "You can't access this resource");
        }
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
        }
        let user = await User.findOne(query).lean();
        if (user) {
            return response(res, 400, null, true, `${errMsg(ErrorFields(errors, result, user))} already registered`);
        }
        result.data.role = process.env.CUSTOMER_ROLE;
        result.data.salesman = req.user._id;
        let uid = new mongodb.ObjectId().toHexString();
        if (req.file) {
            newuser.profile_picture = await S3Upload(IMG_DIR_CONSTS.PROFILE_PICTURE + `/${uid}`, req.file);
        }
        User.findByIdAndUpdate(uid, { $set: result.data }, { new: true, upsert: true, setDefaultsOnInsert: true, select: "-password" }).populate("role manager salesman", "name full_name").lean().exec()
            .then(_user => {
                response(res, 200, _user, false, "User Added successfully");
            })
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Something went wrong");
    }
})
//Add User
router.post("/", authMiddleware, authorizePrivilege("ADD_USER"), upload.single("profile_picture"), async (req, res) => {
    try {
        let result, query, errors;
        switch (req.body.role) {
            case process.env.CUSTOMER_ROLE:
                result = UserController.verifyCustomerAddWeb(req.body);
                query = { mobile_number: result.data.mobile_number };
                errors = ["mobile_number"];
                break;
            case process.env.VENDOR_ROLE:
                result = UserController.verifyVendorAddWeb(req.body);
                query = { email: result.data.email }
                errors = ["email"];
                break;
            case process.env.SALES_MAN_ROLE:
                result = UserController.verifySalesmanAddWeb(req.body);
                query = { email: result.data.email }
                errors = ["email"];
                break;
            case process.env.SALES_MANAGER_ROLE:
                result = UserController.verifySalesManagerAddWeb(req.body);
                query = { email: result.data.email }
                errors = ["email"];
                break;
            case process.env.ADMIN_ROLE:
              result = UserController.verifyAdminProfileWeb(req.body);
              if (result.data.password) {
                result.data.password = bcrypt.hashSync(result.data.password, bcrypt.genSaltSync(10))
              }
              query = { email: result.data.email }
              break;
            default:
                return response(res, 400, null, true, "Invalid role");
        }
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
        }
        let user = await User.findOne(query).lean();
        if (user) {
            return response(res, 400, null, true, `${errMsg(ErrorFields(errors, result, user))} already registered`);
        }
        if (result.data.password && result.data.role != process.env.CUSTOMER_ROLE) {
            console.log("here");
            result.data.password = bcrypt.hashSync(result.data.password, bcrypt.genSaltSync());
        }
        console.log("here1");
        let uid = new mongodb.ObjectId().toHexString();
        if (req.file) {
            newuser.profile_picture = await S3Upload(IMG_DIR_CONSTS.PROFILE_PICTURE + `/${uid}`, req.file);
        }
        User.findByIdAndUpdate(uid, { $set: result.data }, { new: true, upsert: true, setDefaultsOnInsert: true, select: "-password" }).populate("role manager salesman", "name full_name").lean().exec()
            .then(_user => {
                response(res, 200, _user, false, "User Added successfully");
            }).catch(err => {
                console.log(err);
                return response(res, 500, null, true, "Something went wrong");
            })
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Something went wrong");
    }
})

router.put("/update/id/:id", authMiddleware, authorizePrivilege("UPDATE_USER"), upload.single("profile_picture"), async (req, res) => {
    try {
        if (!mongodb.ObjectID.isValid(req.params.id)) {
            return response(res, 400, null, true, `Invalid user id`);
        }
        let result, query, errors;
        switch (req.body.role) {
            case process.env.CUSTOMER_ROLE:
                result = UserController.verifyCustomerProfileWeb(req.body);
                query = { mobile_number: result.data.mobile_number, _id: { $ne: req.params.id } };
                errors = ["mobile_number"];
                break;
            case process.env.VENDOR_ROLE:
                result = UserController.verifyVendorProfileWeb(req.body);
                query = { email: result.data.email, _id: { $ne: req.params.id } };
                errors = ["email"];
                break;
            case process.env.SALES_MAN_ROLE:
                result = UserController.verifySalesmanProfileWeb(req.body);
                query = { email: result.data.email, _id: { $ne: req.params.id } };
                errors = ["email"];
                break;
            case process.env.SALES_MANAGER_ROLE:
                result = UserController.verifySalesManagerProfileWeb(req.body);
                query = { email: result.data.email, _id: { $ne: req.params.id } };
                errors = ["email"];
                break;
            default:
                return response(res, 400, null, true, "Invalid role");
        }
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
        }
        let u = await User.findOne(query).lean();
        if (u) {
            return response(res, 400, null, true, `${errMsg(ErrorFields(errors, result, user))} is already in use by another user`);
        }
        if (req.file) {
            result.data.profile_picture = await S3Upload(IMG_DIR_CONSTS.PROFILE_PICTURE + `/${req.params.id}`, req.file);
        }
        let user = await User.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true, select: "-password" }).lean().populate("role salesman manager", "name full_name").exec();
        response(res, 200, user, false, "User Updated successfully");
    } catch (err) {
        console.log(err);
        return response(res, 500, null, true, "Something went wrong");
    }
})

router.put("/changeStatus/:id", authMiddleware, (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        User.findByIdAndUpdate(req.params.id, { $set: { active: req.body.active } }, { new: true }, (err, doc) => {
            if (err)
                return res.json({ status: 500, errors: true, data: null, message: "Error While updatin" });
            if (doc)
                return res.json({ status: 200, errors: false, data: doc, message: "Status Updated" });
        })
    } else {
        res.status(500).json({ status: 500, errors: true, data: null, message: "Invaid OID" });
    }
})
module.exports = router;
