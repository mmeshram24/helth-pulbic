const Joi = require('joi');
const helper = require('../../utils/helper');
const symptomCreateShcema = Joi.object().keys({
    name: Joi.string().required(),
    // answer: Joi.string().required()
})
const symptomUpdateSchema = Joi.object({
    name: Joi.string().required(),
    // answer: Joi.string().required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(symptom) { return helper.validator(symptom, symptomCreateShcema) }
function verifyUpdate(symptom) { return helper.validator(symptom, symptomUpdateSchema) }
