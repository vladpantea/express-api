const chalk = require('chalk');
const { ValidationError, DBOperationError, FileUploadError } = require('../errors/errors');

function errorLogger(err, req, res, next) {
    if (err && err.error && err.error.stack) {
        console.log(chalk.default.red(err.error.stack));
    } else if (err.message) {
        console.log(chalk.default.red(err.message));
    }
    next(err);
}

function validationErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(400).send({ error: err.message });
    } else if (err instanceof DBOperationError) {
        return res.status(500).send({ error: err.message });
    } else if (err instanceof FileUploadError) {
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