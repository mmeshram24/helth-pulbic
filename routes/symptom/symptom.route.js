const express = require('express');
const isEmpty = require("../../utils/is-empty");
const SymptomController = require('../../controllers/symptom/symptom.controller');
const Symptom = require('../../models/symptom/symptom.model');
const mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
const { upload, S3Upload, IMG_DIR_CONSTS } = require("../../utils/image-upload");
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();


// GET all FAQ
router.get('/', async (req, res) => {
    Symptom.find({}).exec().then(docs => {
        res.json({ status: 200, message: "All symptoms", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching symptoms" });
    })
})

// ADD NEW FAQ
router.post("/", upload.single("icon"), async (req, res) => {
    if (req.user.userType != "admin")
        return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    let result = SymptomController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    if (!req.file) {
        return res.status(400).json({ status: 400, data: null, errors: true, message: "Please select an image first" });
    }
    try {
        result.data.icon = await S3Upload(IMG_DIR_CONSTS.SYMPTOM, req.file);
    } catch (err) {
        console.log(err);
    };
    const newFaq = new Symptom(result.data);
    newFaq.save().then(data => {
        res.status(200).json({ status: 200, errors: false, data, message: "Symptom Added successfully" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new symptom" });
    })
})

// UPDATE FAQ 
router.put('/id/:id', upload.single("icon"), async (req, res) => {
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid faq id" });
    }
    switch (String(req.user.userType)) {
        case "admin":
            break;
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }

    let result = SymptomController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }
    if (req.file) {
        try {
            result.data.icon = await S3Upload(IMG_DIR_CONSTS.SYMPTOM, req.file);
        } catch (err) {
            console.log(err);
        };
    }
    Symptom.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating symptom" });
        }
        else {
            if (!doc)
                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No symptom Found" });
            else {
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Symptom" });
            }
        }
    });
})


// DELETE a FAQ
router.delete('/:id', (req, res) => {
    switch (String(req.user.userType)) {
        case "admin":
            break;
        default: return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    }
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Symptom.findByIdAndDelete(req.params.id).exec().then(u => {
            res.send({ status: 200, errors: false, message: "Symptom deleted successfully", data: u })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the symptom" });
        });
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid symptom id" });
    }
});



module.exports = router;