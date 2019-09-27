const Joi = require('joi');

module.exports.PositionValidationSchema = Joi.object().keys({
    type: Joi.string().valid('fulltime', 'contract').required(),
    company: Joi.string().min(0).required(),
    address: Joi.string().min(0).required(),
    email: Joi.string().email(),
    benefits: Joi.array(),
    description: Joi.string().min(0).required(),
    requirements: Joi.object().required(),
    candidates: Joi.array()
});