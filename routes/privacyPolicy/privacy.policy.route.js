const express = require('express');
const isEmpty = require("../../utils/is-empty");
const PrivacyPolicyController = require('../../controllers/privacyPolicy/privacy.policy.controller');
const PrivacyPolicy = require('../../models/privacyPolicy/privacy.policy.model');
var mongodb = require("mongodb");
const router = express.Router();
const authorizePrivilege = require("../../middleware/authorizationMiddleware");
const authMiddleware = require("../../middleware/authMiddleware")();


// GET about us
router.get('/', async (req, res) => {
    PrivacyPolicy.findOne({}).exec().then(docs => {
        res.json({ status: 200, message: "Aboutus", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching privacy policy" });
    })
})

// UPDATE or ADD Aboutus 
router.put('/update', authMiddleware, async (req, res) => {
    if(String(req.user.userType)!="admin"){
        return res.status(403).json({status:403,data:null,errors:true,message:"You can't access this resource"});
    }
    let result = PrivacyPolicyController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }
    PrivacyPolicy.findOneAndUpdate({}, { $set: result.data }, { new: true, upsert: true }, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating privacy policy" });
        }
        else {
            if (!doc)
                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No FAQ Found" });
            else {
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated privacy policy" });
            }
        }
    });
})



module.exports = router;