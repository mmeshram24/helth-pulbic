const NotificationKeyModel = require("../../../models/notificationkeys/notification.keys.model");
const router = require("express").Router();
const DeviceRegisteration = require("../../../utils/FirebaseService/deviceRegistration");
const DR = new DeviceRegisteration(NotificationKeyModel);
const RTController = require("../../../controllers/notification/notification.key.controller");
const mongodb = require('mongoose').Types;
const isEmpty = require("../../../utils/is-empty");
// Get all languages
// router.get("/", authorizePrivilege("GET_LANGUAGE"), (req, res) => {
//     NotificationKeyModel.find().lean().exec().then(docs => {
//         res.json({ status: 200, data: docs, errors: false, message: "All languages" });
//     }).catch(err => {
//         console.log(err);
//         res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting languages" });
//     })
// })

//Add new language
router.post('/add', async (req, res) => {
    let result = RTController.verifyRegisterationToken(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: true, message: "Fields required" });
    }
    let user = String(req.user._id);
    DR.addNewDeviceGroup(user, result.data.registrationToken).then(notification_key => {
        console.log("RES : ", notification_key);
        res.json({ status: 200, data: null, errors: false, message: "Token added successfully" });
    }).catch(err => {
        console.log("Error : ", err && err.response && err.response.data ? err.response.data : err);
        let message = err.response && err.response.data ? err.response.data.error : "Something went wrong";
        return res.status(500).json({ status: 500, data: null, errors: true, message });
    })
});

//Update a language
// router.put("/update/:id", authorizePrivilege("UPDATE_LANGUAGE"), (req, res) => {
//     if (!mongodb.ObjectId.isValid(req.params.id)) {
//         return res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid language id" });
//     }
//     let result = LanguageController.verifyUpdate(req.body);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//     }
//     NotificationKeyModel.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }).lean().exec()
//         .then(language => {
//             res.status(200).json({ status: 200, data: language, errors: false, message: "Language Updated Successfully" });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating language" })
//         })
// })

module.exports = router;