const multer = require("multer");
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const path = require("path");
const multers3 = require("multer-s3");
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
});

module.exports.upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 4
    }
})
module.exports.uploadCSV = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return callback(new Error('Only csv is allowed'));
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports.S3Upload = (folder, file) => {
    let key = `${folder}/${uuid()}.${file.originalname.split('.').pop()}`
    return new Promise((resolve, reject) => {
        S3.upload({ Bucket: process.env.AWS_S3_BUCKET, Key: key, Body: file.buffer })
            .promise()
            .then(_data => {
                resolve(key);
            }).catch(err => {
                reject(err);
            })
    });
}
module.exports.IMG_DIR_CONSTS = {
    PROFILE_PICTURE: "profile-pictures",
    PRODUCTS: "products",
    VARIENTS: "varients",
    BRANDS: "brands",
    BANNERS: "banners",
    WEB_BANNERS: "web-banners",
    CATEGORY: "category",
    VIDEO:'product-video',
    ABOUT_US:"aboutus",
    SYMPTOM:"symptom",
    KYC:"kyc"
}
module.exports.uploadFromBuffer = (folder, buffer, extension) => {
    let key = `${folder}/${uuid()}.${extension}`;
    console.log("KEY IS : ",key);
    return new Promise((resolve, reject) => {
        S3.upload({ Bucket: process.env.AWS_S3_BUCKET, Key: key, Body: buffer })
            .promise()
            .then(_data => {
                resolve(key);
            }).catch(err => {
                reject(err);
            })
    });
}
module.exports.uploadVideo = (folder) => multer({
    storage: multers3({
        s3: S3,
        bucket: process.env.AWS_S3_BUCKET,
        key: function (req, file, cb) {
            cb(null, `${folder}/${uuid()}.${file.originalname.split('.').pop()}`)
        }
    }),
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        if (ext !== '.mpeg4' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.avi' && ext !== '.wmv') {
            return callback(new Error('Only mpeg4,mp4,mkv,avi and wmv videos are allowed'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 100
    }
})

module.exports.deleteFile = (key) => {
    return new Promise((resolve, reject) => {
        S3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: key }).promise().then(_data => {
            resolve(_data);
        }).catch(err => {
            reject(err);
        })
    });
}