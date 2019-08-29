const chalk = require('chalk');
const ValidationError = require('../errors/errors').ValidationError;

function errorLogger(err, req, res, next) {
    if (err.message) {
        console.log(chalk.default.red(err.message));
    }
    next(err);
}

function validationErrorHandler(err, req, res, next) {
    if(err instanceof ValidationError){
        return res.sendStatus(400);
    }
    next(err);
}

function genericErrorHandler(err, req, res, next) {
    res.sendStatus(500);    
    next();
}

module.exports = function ErrorHandlingMiddleware(app){
    app.use([
        errorLogger,
        validationErrorHandler,
        genericErrorHandler
    ]);
}