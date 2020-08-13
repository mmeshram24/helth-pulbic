const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = { validator, tokenGenerator }

function validator(data, modelSchema) {
    return Joi.validate(data, modelSchema, { abortEarly: false }, (err, value) => {
        let data = {
            errors: {},
            data: {}
        };
        if (err) {
            err.details.forEach(err => {
                let temp = { [err.message.split('"')[1]]: err.message }
                data.errors = { ...data.errors, ...temp }
            })
            return data
        }
        else {
            data.data = { ...value }
            return data
        }
    });
}

function tokenGenerator(payload) {
    return jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 3600 }
    );
}
