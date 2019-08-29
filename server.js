const express = require('express');
const Middleware = require('./middleware/middleware');
const dotenv = require('dotenv');
const ErrorHandlingMiddleware = require('./middleware/error-handler');


dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
Middleware(app);

const PlansController = require('./controllers/plans-controller');
app.use('/api/plans', PlansController);

const SubscriptionController = require('./controllers/subscriptions-controller');
app.use('/api/subscriptions', SubscriptionController);

ErrorHandlingMiddleware(app);

app.listen(PORT, () => {
    console.log(`Application running on port: ${PORT}`);
});