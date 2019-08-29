const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const SubscriptionService = require('../services/subscription-service');

const subscriptionService = new SubscriptionService();

router.get('/', asyncWrapper(async (req, res) => {
    let userId = null;
    let subscriptions = await subscriptionService.findAll(userId);
    res.send(subscriptions);    
}));

router.get('/:id', asyncWrapper(async (req, res) => {
    let id = null;
    let subscription = await subscriptionService.findOne(id);
    res.send(subscription);
}));

router.post('/', asyncWrapper(async (req, res) => {
    let subscription = {};
    let createdSubscription = await subscriptionService.create(subscription);
    res.send(createdSubscription);
}));

router.delete('/:id', asyncWrapper(async (req, res) => {
    let id = null;
    await subscriptionService.deleteOne(id);
    res.sendStatus(200);
}));

module.exports = router;