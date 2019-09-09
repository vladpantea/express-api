const Joi = require('joi');
const { SubscriptionValidationSchema } = require('../models/subscriptions');
const { PlanValidationSchema } = require('../models/plans');
const { IdValidationSchema } = require('../models/generic');
const { ValidationError } = require('../errors/errors');

'use strict'

let validators = {
    'Subscription': {
        scopes: {
            default: SubscriptionValidationSchema,
            id: IdValidationSchema
        }
    },
    'Plan': {
        scopes: {
            default: PlanValidationSchema,
            id: IdValidationSchema
        }
    }
};

function scopeExists(validator, scope) {
    return Object.keys(validator.scopes).find(key => key === scope) !== undefined;
}

function getSchema(model, scope) {
    let validator = validators[model];
    if (!validator) {
        throw new Error('Valiadtor does not exist');
    }

    if (validator.scopes) {
        if (scope) {
            if (!scopeExists(validator, scope)) {
                throw new Error('Scope does not exist on the validator');
            } else {
                return validator.scopes[scope];
            }
        } else {
            return validator.scopes.default;
        }
    } else {
        return validator;
    }
}

function validate(model, object, scope) {
    return Joi.validate(object, getSchema(model, scope), {
        allowUnknown: true
    });
}

module.exports = function ValidationMiddleware(model, scope) {
    return (req, res, next) => {
        let reqMethod = req.method;
        let validationResult = null;

        if (reqMethod === 'GET' || reqMethod === 'DELETE') {
            validationResult = validate(model, req.params, scope);
        } else {
            validationResult = validate(model, req.body, scope);
        }

        if (validationResult.error) {
            throw new ValidationError(validationResult.error.message);
        } else {
            next();
        }
    }
}