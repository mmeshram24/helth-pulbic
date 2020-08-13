const helper = require('../../utils/helper');
const Joi = require('joi');


const adminProfileSchema = Joi.object({
    full_name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    address: Joi.string().optional()
})
const patientProfileSchema = Joi.object({
    full_name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.date().required(),
    address: Joi.object().keys({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
    }).required(),
    gender: Joi.string().valid(["male", "female"]).required(),
})
const doctorProfileSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    dob: Joi.date().optional(),
    gender: Joi.string().valid(["male", "female"]).optional(),
    symptoms: Joi.array().items(Joi.string().required()).optional(),
    languages: Joi.array().items(Joi.string().required()).optional(),
    location: Joi.array().items(Joi.number().required()).max(2).min(2).optional(),
    professionalStatement: Joi.string().allow("").optional(),
    education: Joi.string().allow("").optional(),
    college: Joi.string().allow("").optional(),
    stateLicense: Joi.string().allow("").optional(),
    licenseExpiration: Joi.string().allow("").optional(),
    boardExpiration: Joi.string().allow("").optional(),
    yearsOfExperience: Joi.string().allow("").optional(),
    malpracticeLawsuites: Joi.boolean().optional(),
    medicalBoardDeciplinaryAction: Joi.boolean().optional(),
    "checkbox1.accepted": Joi.boolean().optional(),
    "checkbox2.accepted": Joi.boolean().optional(),
    "checkbox3.accepted": Joi.boolean().optional(),
    "checkbox4.accepted": Joi.boolean().optional(),
    "checkbox5.accepted": Joi.boolean().optional(),
})
const customerProfileWebSchema = Joi.object({
    full_name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    address: Joi.string().allow("").optional(),
    role: Joi.string().required(),
    active: Joi.boolean().optional()
})
const customerAddWebSchema = Joi.object({
    full_name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    address: Joi.string().allow("").optional(),
    role: Joi.string().required(),
    salesman: Joi.string().required(),
    active: Joi.boolean().optional()
})
const userPasswordUpdateSchema = Joi.object({
    user: Joi.string().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})
const userPasswordUpdateOwnSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})
const userRegisterSchema = Joi.object({
    full_name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
})
const userMobileRegisterSchema = Joi.object({
    mobile_number: Joi.string().length(10).required()
})
const userMobileLoginSchema = Joi.object({
    mobile_number: Joi.string().length(10).required()
})
const userMobileOtpSchema = Joi.object({
    mobile_number: Joi.string().length(10).required(),
    otp: Joi.string().required()
})

const userLoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required()
})
module.exports = {
    verifyRegister,
    verifyLogin,
    verifyMobileRegister,
    verifyMobileLogin,
    verifyMobileOtp,
    verifyPatientProfile,
    verifyDoctorProfile,
    verifyAdminProfile,
    verifyCustomerProfileWeb,
    verifyUserPasswordUpdateOwn,
    verifyUserPasswordUpdate,
    verifyCustomerAddWeb,
}

function verifyPatientProfile(user) { return helper.validator(user, patientProfileSchema) }

function verifyDoctorProfile(user) { return helper.validator(user, doctorProfileSchema) }

function verifyAdminProfile(user) { return helper.validator(user, adminProfileSchema) }

function verifyCustomerProfileWeb(user) { return helper.validator(user, customerProfileWebSchema) }

function verifyCustomerAddWeb(user) { return helper.validator(user, customerAddWebSchema) }

function verifyUserPasswordUpdateOwn(user) { return helper.validator(user, userPasswordUpdateOwnSchema) }

function verifyUserPasswordUpdate(user) { return helper.validator(user, userPasswordUpdateSchema) }

function verifyRegister(user) { return helper.validator(user, userRegisterSchema) }

function verifyMobileRegister(user) { return helper.validator(user, userMobileRegisterSchema) }

function verifyMobileLogin(user) { return helper.validator(user, userMobileLoginSchema) }

function verifyLogin(user) { return helper.validator(user, userLoginSchema) }

function verifyMobileOtp(user) { return helper.validator(user, userMobileOtpSchema) }