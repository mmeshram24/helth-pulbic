const express = require('express');
const isEmpty = require("../../utils/is-empty");
const FaqController = require('../../controllers/faq/faq.controller');
const FAQ = require('../../models/faq/faq.model');
var mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
// const { upload, S3Upload } = require("../../utils/image-upload");
const authorizePrivilege = require("../../middleware/authorizationMiddleware");
const authMiddleware = require("../../middleware/authMiddleware")();


// GET all FAQ
router.get('/', async (req, res) => {
    FAQ.find({}).exec().then(docs => {
        res.json({ status: 200, message: "All faqs", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching customers" });
    })
})

// ADD NEW FAQ
router.post("/", authMiddleware, (req, res) => {
    if(String(req.user.userType)!="admin"){
        return res.status(403).json({status:403,data:null,errors:true,message:"You can't access this resource"});
    }
    let result = FaqController.verifyCreate(req.body)
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    const newFaq = new FAQ(result.data);
    newFaq.save().then(data => {
        res.status(200).json({ status: 200, errors: false, data, message: "FAQ Added successfully" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new FAQ" });
    })
})

// UPDATE FAQ 
router.put('/id/:id', authMiddleware, (req, res) => {
    if(String(req.user.userType)!="admin"){
        return res.status(403).json({status:403,data:null,errors:true,message:"You can't access this resource"});
    }
    if (!mongodb.ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid faq id" });
    }
    let result = FaqController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }

    FAQ.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating faq" });
        }
        else {
            if (!doc)
                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No FAQ Found" });
            else {
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Customer" });
            }
        }
    });
})


// DELETE a FAQ
router.delete('/:id', authMiddleware, (req, res) => {
    if(String(req.user.userType)!="admin"){
        return res.status(403).json({status:403,data:null,errors:true,message:"You can't access this resource"});
    }
    if (mongodb.ObjectID.isValid(req.params.id)) {
        FAQ.findByIdAndDelete(req.params.id).exec().then(u => {
            res.send({ status: 200, errors: false, message: "FAQ deleted successfully", data: u })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the faq" });
        });
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid faq id" });
    }
});



module.exports = router;