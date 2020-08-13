const express = require('express');
const isEmpty = require("../../utils/is-empty");
const mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
// const { upload, S3Upload, IMG_DIR_CONSTS } = require("../../utils/image-upload");
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();


// // GET all FAQ
// router.get('/', async (req, res) => {
//     Symptom.find({}).exec().then(docs => {
//         res.json({ status: 200, message: "All symptoms", errors: false, data: docs });
//     }).catch(err => {
//         console.log(err);
//         res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching symptoms" });
//     })
// })

// ADD NEW FAQ
router.post("/", async (req, res) => {
    return res.json({ status: 200, data: null, errors: true, message: "Not implemented" });
    // let msg = `Name : ${name}\nPhone : ${phone}\nEmail : ${email}\nMessage : ${message}`;
    // mailer("null", "Contact Form", msg)
    // res.json({ status: 200, data: null, errors: false, message: "Success" });
    // newFaq.save().then(data => {
    //     res.status(200).json({ status: 200, errors: false, data, message: "Symptom Added successfully" });
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new symptom" });
    // })
})

module.exports = router;