const express = require('express');
const isEmpty = require("../../utils/is-empty");
const FavouriteController = require('../../controllers/favourite doctor/favourite.doctor.controller');
const Favourite = require('../../models/favourite doctor/favourite.doctor.model');
var mongodb = require("mongodb");
// const moment = require('moment');
const router = express.Router();
// const { upload, S3Upload } = require("../../utils/image-upload");
// const authorizePrivilege = require("../../middleware/authorizationMiddleware");
// const authMiddleware = require("../../middleware/authMiddleware")();


// GET own Addresss
router.get('/', async (req, res) => {
    Favourite.find({ user: req.user._id }).lean().exec().then(docs => {
        res.json({ status: 200, message: "All favourites", errors: false, data: docs });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching favourites" });
    })
})

// ADD NEW Address
router.post("/", (req, res) => {
    if (req.user.userType != "patient")
        return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
    let result = FavouriteController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
    Favourite.findOneAndUpdate({ user: req.user._id, doctor: result.data.doctor }, { $set: { doctor: result.data.doctor } }, { new: true, upsert: true })
        .lean().exec()
        .then(data => {
            res.status(200).json({ status: 200, errors: false, data, message: "Favourite Added successfully" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new favourite" });
        })
})

// UPDATE Address
// router.put('/id/:id', (req, res) => {
//     if (!mongodb.ObjectID.isValid(req.params.id)) {
//         return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid address id" });
//     }
//     if (req.user.userType != "patient")
//         return res.status(403).json({ status: 403, data: null, errors: true, message: "You can't access this resource" });
//     let result = FavouriteController.verifyUpdate(req.body);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
//     }
//     Favourite.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating language" });
//         }
//         else {
//             if (!doc)
//                 return res.status(200).json({ status: 200, errors: true, data: doc, message: "No language Found" });
//             else {
//                 res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Language" });
//             }
//         }
//     }).lean();
// })


// DELETE a address
router.delete('/:id', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Favourite.findOneAndDelete({ _id: req.params.id, user: req.user._id }).exec().then(u => {
            res.send({ status: 200, errors: false, message: "Favourite deleted successfully", data: u })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the favourite" });
        });
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid favourite id" });
    }
});



module.exports = router;