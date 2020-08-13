const Joi = require('joi');
const helper = require('../../utils/helper');
const questionCreateShcema = Joi.object().keys({
    title: Joi.string().required(),
    answers: Joi.array().items(Joi.string().required()).min(1).required(),
    symptom: Joi.string().required()
})
const questionUpdateSchema = Joi.object({
    title: Joi.string().required(),
    answers: Joi.array().items(Joi.string().required()).min(1).required(),
    symptom: Joi.string().required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(question) { return helper.validator(question, questionCreateShcema) }
function verifyUpdate(question) { return helper.validator(question, questionUpdateSchema) }
