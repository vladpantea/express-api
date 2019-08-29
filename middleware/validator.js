const Joi = require('joi');
const Subscription = require('../models/subscriptions');
const Plan = require('../models/plans');
const ValidationError = require('../errors/errors').ValidationError;

'use strict'

let validators = {
    'Subscription': {
        scopes: {
            default: Subscription.SubscriptionValidationSchema
        }
    },
    'Plan': {
        scopes: {
            default: Plan.PlanValidationSchema
        }
    }
};

function scopeExists(validator, scope) {
    return Object.keys(validator.scope).find(key => key === scope) !== undefined;
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
        const validationResult = validate(model, req.body, scope);
        if (validationResult.error) {
            throw new ValidationError(validationResult.error.message);
        } else {
            next();
        }
    }
}