const Joi = require('joi');
const helper = require('../../utils/helper');
// const faqCreateShcema = Joi.object().keys({
//     question: Joi.string().required(),
//     answer: Joi.string().required()
// })
const privacyPolicyUpdateSchema = Joi.object({
    paragraph: Joi.string().required()
})

module.exports = {
    // verifyCreate,
    verifyUpdate
}


// function verifyCreate(faq) { return helper.validator(faq, faqCreateShcema) }
function verifyUpdate(pp) { return helper.validator(pp, privacyPolicyUpdateSchema) }
