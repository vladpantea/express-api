const Joi = require('Joi');

module.exports.IdValidationSchema = Joi.object().keys({    
    id: Joi.string().min(24).max(24).required()
});