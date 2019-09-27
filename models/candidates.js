const Joi = require('joi');

module.exports.CandidateValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
});

module.exports.CVValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    cv: Joi.string().required()
});