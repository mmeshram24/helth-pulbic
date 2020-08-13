const Joi = require('joi');
const helper = require('../../utils/helper');
const familyMemberCreateShcema = Joi.object().keys({
    name: Joi.string().required(),
    age: Joi.date().required(),
    gender: Joi.string().valid(["male","female"]).required(),
    relationWithAccountHolder: Joi.string().required(),
    history: Joi.object().keys({
        medicalProblems: Joi.array().items(Joi.string().required()).required(),
        surgeries: Joi.array().items(Joi.string()).required(),
        currentMedication:Joi.array().items(Joi.string()).required(),
        smoking: Joi.boolean().required()
    }).required()
})
const familyMemberUpdateSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.date().required(),
    gender: Joi.string().valid(["male","female"]).required(),
    relationWithAccountHolder: Joi.string().required(),
    history: Joi.object().keys({
        medicalProblems: Joi.array().items(Joi.string().required()).required(),
        surgeries: Joi.array().items(Joi.string().required()),
        currentMedication:Joi.array().items(Joi.string().required()),
        smoking: Joi.boolean().required()
    }).required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(member) { return helper.validator(member, familyMemberCreateShcema) }
function verifyUpdate(member) { return helper.validator(member, familyMemberUpdateSchema) }
