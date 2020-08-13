const express = require('express');
const isEmpty = require("../../utils/is-empty");
const BookingController = require('../../controllers/booking/booking.controller');
const Booking = require('../../models/booking/booking.model');
const mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
const { upload, S3Upload, IMG_DIR_CONSTS } = require("../../utils/image-upload");
const { mongo } = require('../../config/config');
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();


// GET all FAQ
router.get('/', async (req, res) => {
    let query;
    switch (req.user.userType) {
        case "patient":
            query = { createdBy: req.user._id };
            break;
        case "doctor":
            query = { doctor: req.user._id };
            break;
        case "admin":
            query = { };
            break;
    }
    // if (!mongodb.ObjectID.isValid(req.params.id)) {
    //     return res, status(400).json({ status: 400, data: null, errors: true, message: "Invalid symptom id" });
    // }
    Booking.find(query).sort({ createdAt: -1 }).populate([{ path: "doctor createdBy language", select: "full_name name" }]).exec().then(docs => {
        res.json({ status: 200, message: "All appointments", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching appointments" });
    })
})

// ADD NEW Appointment
router.post("/", async (req, res) => {
    if (req.user.userType == "admin" || req.user.userType == "doctor")
        return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    let result = BookingController.verifyCreate(req.body);
    const util = require('util')

console.log(util.inspect(req.body, {showHidden: false, depth: null}))
    // console.log("DATA : ",req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    result.data.createdBy = req.user._id;
    Booking.findByIdAndUpdate(new mongodb.ObjectID().toHexString(), result.data, { upsert: true, setDefaultsOnInsert: true, new: true }).lean().exec()
        .then(data => {
            res.status(200).json({ status: 200, errors: false, data, message: "Appointment Created successfully" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new appointment" });
        })
})

// UPDATE FAQ 
// router.put('/id/:id', (req, res) => {
//     if (req.user.userType != "admin")
//         return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
//     if (!mongodb.ObjectID.isValid(req.params.id)) {
//         return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid question id" });
//     }
//     let result = BookingController.verifyUpdate(req.body);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
//     }
//     Booking.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating symptom" });
//         }
//         else {
//             if (!doc)
//                 return res.status(200).json({ status: 200, errors: true, data: doc, message: "No question Found" });
//             else {
//                 res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Question" });
//             }
//         }
//     });
// })


// DELETE a FAQ
// router.delete('/:id', (req, res) => {
//     switch (String(req.user.userType)) {
//         case "admin":
//             break;
//         default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
//     }
//     if (mongodb.ObjectID.isValid(req.params.id)) {
//         Booking.findByIdAndDelete(req.params.id).exec().then(u => {
//             res.send({ status: 200, errors: false, message: "Question deleted successfully", data: u })
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the question" });
//         });
//     } else {
//         res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid question id" });
//     }
// });



module.exports = router;