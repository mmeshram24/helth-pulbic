const Joi = require('joi');
const helper = require('../../utils/helper');
const registerationTokenSchema = Joi.object({
    registrationToken: Joi.string().required(),
})

module.exports = {
    verifyRegisterationToken,
}

function verifyRegisterationToken(token) { return helper.validator(token, registerationTokenSchema) }