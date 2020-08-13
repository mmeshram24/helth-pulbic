// const UserRole = require("../models/userRole.model");
// const parseId = require("mongoose").Types.ObjectId;
// const isEmpty = require("../utils/is-empty")
module.exports = (req, res, next) => {
    // let UserRoleFields = ["CUSTOMER_ROLE", "ADMIN_ROLE", "HUB_ROLE"];
    // let OrderStatusFields = ["ORDERSTATUS_PENDING"];
    // let errors = {};
    // UserRoleFields.forEach(async element => {
    //     if (process.env[element] && process.env[element].trim().length>0) {
    //         if (parseId.isValid(process.env[element])) {
    //             let rs = await UserRole.exists({ _id: parseId(process.env[element]) });
    //             console.log("RS IS ",rs);
    //             if (!rs) {
    //                 errors[element] = `${element} not exist`;
    //             }
    //         } else {
    //             errors[element] = `${element} is not a valid value`;
    //         }
    //     } else {
    //         errors[element] = `${element} is not set`;
    //     }
    // })
    // OrderStatusFields.forEach(async element => {
    //     if (process.env[element] && process.env[element].trim().length>0) {
    //         if (parseId.isValid(process.env[element])) {
    //             let rs = await OrderStatus.exists({ _id: parseId(process.env[element]) });
    //             if (!rs) {
    //                 errors[element] = `${element} not exist in database`;
    //             }
    //         } else {
    //             console.log("Called");
    //             errors[element] = `${element} is not a valid value`;
    //         }
    //     } else {
    //         errors[element] = `${element} is not set`;
    //     }
    // })
    // if (isEmpty(errors)) {
        next();
    // } else {
    //     res.status(400).json({ status: 400, data: null, errors, message: "Please make the suggested changes in environment variable" });
    // }
    // console.log(mongodb.ObjectID.isValid(process.env["CUSTOMER_ROLE"]));
}