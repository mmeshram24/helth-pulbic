const express = require('express');
const isEmpty = require("../../utils/is-empty");
const FamilyMemberController = require('../../controllers/family/family.member.controller');
const FamilyMember = require('../../models/family/family.model');
var mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
// const { upload, S3Upload } = require("../../utils/image-upload");
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();


// GET own Addresss
router.get('/', async (req, res) => {
    switch (req.user.userType) {
        case "patient":
            break;
        // case "doctor":
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    FamilyMember.find({ user: req.user._id },"name age gender relationWithAccountHolder").lean().exec().then(docs => {
        res.json({ status: 200, message: "All family members", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching family members" });
    })
})

router.get('/user/:user', async (req, res) => {
    switch (req.user.userType) {
        case "admin":
            break;
        // case "doctor":
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    FamilyMember.find({ user: req.params.user }).lean().exec().then(docs => {
        res.json({ status: 200, message: "All family members", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching family members" });
    })
})

// ADD NEW Address
router.post("/", (req, res) => {
    switch (req.user.userType) {
        case "patient":
            break;
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    let result = FamilyMemberController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    result.data.user = req.user._id;
    const newAddress = new FamilyMember(result.data);
    newAddress.save().then(data => {
        res.status(200).json({ status: 200, errors: false, data, message: "Family Member Added successfully" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new family member" });
    })
})

router.get('/id/:id', (req, res) => {
    switch (req.user.userType) {
        case "patient":
            break;
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid patient id" });
    }
    FamilyMember.findOne({ _id: req.params.id, user: req.user._id }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating patient" });
        }
        else {
            return res.status(200).json({ status: 200, errors: true, data: doc, message: "Patient" });
        }
    }).lean();
})
// UPDATE Address
router.put('/id/:id', (req, res) => {
    switch (req.user.userType) {
        case "patient":
            break;
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid patient id" });
    }
    let result = FamilyMemberController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }
    FamilyMember.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: result.data }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating patient" });
        }
        else {
            if (!doc)
                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No patient Found" });
            else {
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated patient" });
            }
        }
    }).lean();
})

// DELETE a address
router.delete('/:id', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        FamilyMember.findOneAndDelete({ _id: req.params.id, user: req.user._id }).exec().then(u => {
            res.send({ status: 200, errors: false, message: "Address deleted successfully", data: u })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the address" });
        });
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid address id" });
    }
});

module.exports = router;