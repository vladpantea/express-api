const express = require('express')
const Middleware = require('./middleware/middleware')
const ErrorHandlingMiddleware = require('./middleware/error-handler')
const chalk = require('chalk')

const app = express()
Middleware(app)

const PositionsController = require('./controllers/positions-controller')
app.use('/api/positions', PositionsController)

const CandidatesController = require('./controllers/candidates-controller')
app.use('/api/candidates', CandidatesController.router)

ErrorHandlingMiddleware(app)

const gracefullyClean = (ctrl) => {
    ctrl.connClose().then(() => {
        console.log(chalk.blue('Db connection closed'))
    })
}

process.on('SIGTERM', gracefullyClean.bind(this,CandidatesController))

module.exports = {
    app: app,
    gracefullyClean: gracefullyClean,
    candidatesCtrl: CandidatesController
}