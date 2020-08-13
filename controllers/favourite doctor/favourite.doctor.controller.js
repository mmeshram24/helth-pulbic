const Joi = require('joi');
const helper = require('../../utils/helper');
const favouriteCreateShcema = Joi.object().keys({
    doctor: Joi.string().required(),
})
const languageUpdateSchema = Joi.object({
    name: Joi.string().required(),
})

module.exports = {
    verifyCreate,
    // verifyUpdate
}


function verifyCreate(doctor) { return helper.validator(doctor, favouriteCreateShcema) }
// function verifyUpdate(address) { return helper.validator(address, languageUpdateSchema) }
