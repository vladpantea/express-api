const { ValidationError } = require('../errors/errors');
const errorHelper = require('../utilities/error-helper');
module.exports = function ValidationMiddleware(model, scope) {
    return (req, res, next) => {
        let reqMethod = req.method;

        function valid(err, valid) {
            if (err) {
                next(new ValidationError(err.message, err));
            } else {
                next();
            }
        };

        if (reqMethod === 'GET' || reqMethod === 'DELETE') {
            errorHelper.validate(model, req.params, scope, valid);
        } else {
            errorHelper.validate(model, req.body, scope, valid);
        }
    }
}