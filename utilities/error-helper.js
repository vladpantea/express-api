const Joi = require('joi');
const { PositionValidationSchema } = require('../models/positions');
const { CandidateValidationSchema, CVValidationSchema } = require('../models/candidates');
const { IdValidationSchema } = require('../models/generic');

module.exports = (function(){
    'use strict'

    let validators = {
        'Position': {
            scopes: {
                default: PositionValidationSchema,
                id: IdValidationSchema
            }
        },
        'Candidate': {
            scopes: {
                default: CandidateValidationSchema,
                id: IdValidationSchema,
                cv: CVValidationSchema
            }
        }
    };
    
    function scopeExists(validator, scope) {
        return Object.keys(validator.scopes).find(key => key === scope) !== undefined;
    }
    
    function getSchema(model, scope) {
        let validator = validators[model];
        if (!validator) {
            throw new Error('Validator does not exist');
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
    
    function validate(model, object, scope, cb) {
        return Joi.validate(object, getSchema(model, scope), {
            allowUnknown: true
        },(err,ok) => {
            if(err){
                cb(err);
            }else{
                cb(err,ok);
            }
        });
    }


    return {
        scopeExists: scopeExists,
        getSchema: getSchema,
        validate: validate
    }
})();


