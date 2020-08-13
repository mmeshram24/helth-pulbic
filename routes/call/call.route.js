const express = require('express');
const isEmpty = require("../../utils/is-empty");
const AboutUsController = require('../../controllers/aboutus/aboutus.controller');
const AboutUs = require('../../models/aboutus/aboutus.model');
var mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
const { upload, S3Upload, IMG_DIR_CONSTS } = require("../../utils/image-upload");
const authorizePrivilege = require("../../middleware/authorizationMiddleware");
const authMiddleware = require("../../middleware/authMiddleware")();
const Notification = require("../../utils/FirebaseService/notification");
const NotificationKeyModel = require("../../models/notificationkeys/notification.keys.model");

// GET about us
router.post('/id/:id', async (req, res) => {
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid id" });
    }
    let notif = new Notification(req.params.id, "Call", "calling", NotificationKeyModel);
    notif.send().then(docs => {
        res.json({ status: 200, message: "Call", errors: false, data: null });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while calling" });
    })
})

// UPDATE or ADD Aboutus 
// router.put('/update', authMiddleware, upload.single("image"), async (req, res) => {
//     if (String(req.user.userType) != "admin") {
//         return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
//     }
//     let result = AboutUsController.verifyUpdate(req.body);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
//     }
//     if (req.file) {
//         try {
//             result.data.image = await S3Upload(IMG_DIR_CONSTS.ABOUT_US, req.file);
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     AboutUs.findOneAndUpdate({}, { $set: result.data }, { new: true, upsert: true }, (err, doc) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating aboutus" });
//         }
//         else {
//             if (!doc)
//                 return res.status(200).json({ status: 200, errors: true, data: doc, message: "No aboutus Found" });
//             else {
//                 res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated About us" });
//             }
//         }
//     });
// })



module.exports = router;