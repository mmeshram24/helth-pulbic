const Joi = require('joi');
const helper = require('../../utils/helper');
const Question = Joi.object().keys({
    question: Joi.string().required(),
    answers: Joi.array().items(Joi.string().required()).min(1).required(),
}).required();
const Symptoms = Joi.object().keys({
    symptom: Joi.string().required(),
    questions: Joi.array().items(Question).min(1).required(),
}).required()
const bookingCreateShcema = Joi.object().keys({
    doctor: Joi.string().required(),
    language: Joi.string().required(),
    patient: Joi.object().keys({
        name: Joi.string().required(),
        age: Joi.number().integer().required(),
        gender: Joi.string().valid("male", "female").required(),
        relationWithAccountHolder: Joi.string().required(),
        history: Joi.object().keys({
            medicalProblems: Joi.array().items(Joi.string().required()).required(),
            surgeries: Joi.array().items(Joi.string().required()).required(),
            currentMedication: Joi.array().items(Joi.string().required()).required(),
            smoking: Joi.boolean().required()
        }).required()
    }),
    callDuration: Joi.number().integer().positive().required(),
    callType: Joi.string().valid(["audio", "video"]).required(),
    symptoms: Joi.array().items(Symptoms).min(1).required(),
})
// const questionUpdateSchema = Joi.object({
//     title: Joi.string().required(),
//     answers: Joi.array().items(Joi.string().required()).min(1).required(),
//     symptom: Joi.string().required()
// })

module.exports = {
    verifyCreate,
    // verifyUpdate
}


function verifyCreate(question) { return helper.validator(question, bookingCreateShcema) }
// function verifyUpdate(question) { return helper.validator(question, questionUpdateSchema) }
