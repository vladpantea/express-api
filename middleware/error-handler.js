const chalk = require('chalk');
const { ValidationError, DeleteError } = require('../errors/errors');

function errorLogger(err, req, res, next) {
    if (err.message) {
        console.log(chalk.default.red(err.message));
    }
    next(err);
}

function validationErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.sendStatus(400);
    } else if (err instanceof DeleteError) {
        return res.sendStatus(400);
    }
    next(err);
}

function genericErrorHandler(err, req, res, next) {
    res.sendStatus(500);
    next();
}

module.exports = function ErrorHandlingMiddleware(app) {
    app.use([
        errorLogger,
        validationErrorHandler,
        genericErrorHandler
    ]);
}