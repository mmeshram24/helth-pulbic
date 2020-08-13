const express = require('express');
const isEmpty = require("../../utils/is-empty");
const LanguageController = require('../../controllers/language/language.controller');
const Language = require('../../models/language/language.model');
var mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
// const { upload, S3Upload } = require("../../utils/image-upload");
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();

// GET own Addresss
router.get('/', async (req, res) => {
    Language.find({}).lean().exec().then(docs => {
        res.json({ status: 200, message: "All languages", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching languages" });
    })
})

// ADD NEW Address
router.post("/", (req, res) => {
    if (req.user.userType != "admin")
        return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    let result = LanguageController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    const newLanguage = new Language(result.data);
    newLanguage.save().then(data => {
        res.status(200).json({ status: 200, errors: false, data, message: "Language Added successfully" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new Language" });
    })
})

// UPDATE Address
router.put('/id/:id', (req, res) => {
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid address id" });
    }
    if (req.user.userType != "admin")
        return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    let result = LanguageController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }
    Language.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating language" });
        }
        else {
            if (!doc)
                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No language Found" });
            else {
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Language" });
            }
        }
    }).lean();
})


// DELETE a address
// router.delete('/:id', (req, res) => {
//     if (mongodb.ObjectID.isValid(req.params.id)) {
//         Language.findOneAndDelete({ _id: req.params.id, user: req.user._id }).exec().then(u => {
//             res.send({ status: 200, errors: false, message: "Address deleted successfully", data: u })
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the address" });
//         });
//     } else {
//         res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid address id" });
//     }
// });



module.exports = router;