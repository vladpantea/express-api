const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const PlansService = require('../services/plans-service');
const validation = require('../middleware/validator');

const plansService = new PlansService();

router.get('/', asyncWrapper(async (req, res) => {
    let userId = null;
    let plans = await plansService.findAll(userId);
    res.send(plans);
}));

router.get('/:id', asyncWrapper(async (req, res) => {
    let id = null;
    let plan = await plansService.findOne(id);
    res.send(plan);
}));

router.post('/', [validation("Plan")], asyncWrapper(async (req, res) => {
    throw new Error('Naspa');
    let plan = {};
    let createdPlan = await plansService.create(plan);
    res.send(createdPlan);
}));

/* router.post('/', [validation('Plan')], asyncWrapper(async (req, res) => {
    let plan = {};
    let createdPlan = await plansService.create(plan);
    res.send(createdPlan);
})); */

router.delete('/:id', asyncWrapper(async (req, res) => {
    let id = null;
    await plansService.deleteOne(id);
    res.sendStatus(200);
}));

module.exports = router;