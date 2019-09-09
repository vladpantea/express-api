const express = require('express');
const Middleware = require('./middleware/middleware');
const dotenv = require('dotenv');
const ErrorHandlingMiddleware = require('./middleware/error-handler');

dotenv.config();

const app = express();
Middleware(app);

const PlansController = require('./controllers/plans-controller');
app.use('/api/plans', PlansController);

const SubscriptionController = require('./controllers/subscriptions-controller');
app.use('/api/subscriptions', SubscriptionController);

ErrorHandlingMiddleware(app);

module.exports = app;