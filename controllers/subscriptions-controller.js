const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const SubscriptionService = require('../services/subscription-service');
const validation = require('../middleware/validator');

const subscriptionService = new SubscriptionService();

router.get('/', asyncWrapper(async (req, res) => {
    let subscriptions = await subscriptionService.findAll();
    res.send(subscriptions);    
}));

router.get('/:id', [validation("Subscription","id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    let subscription = await subscriptionService.findOne(id);
    res.send(subscription.length > 0 ? subscription[0] : {});
}));

router.post('/', [validation("Subscription")], asyncWrapper(async (req, res) => {
    let subscription = req.body;
    let createdSubscription = await subscriptionService.create(subscription);
    res.send(createdSubscription);
}));

router.delete('/:id', [validation("Subscription","id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    await subscriptionService.deleteOne(id);
    res.sendStatus(204);
}));

module.exports = router;