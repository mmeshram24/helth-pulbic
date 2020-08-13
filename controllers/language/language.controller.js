const Joi = require('joi');
const helper = require('../../utils/helper');
const languageCreateShcema = Joi.object().keys({
    name: Joi.string().required(),
})
const languageUpdateSchema = Joi.object({
    name: Joi.string().required(),
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(address) { return helper.validator(address, languageCreateShcema) }
function verifyUpdate(address) { return helper.validator(address, languageUpdateSchema) }
