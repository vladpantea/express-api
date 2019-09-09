const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const PlansService = require('../services/plans-service');
const validation = require('../middleware/validator');

const plansService = new PlansService();

router.get('/', asyncWrapper(async (req, res) => {
    let plans = await plansService.findAll();
    res.send(plans);
}));

router.get('/:id', [validation("Plan","id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    let plan = await plansService.findOne(id);
    res.send(plan.length > 0 ? plan[0] : {});
}));

router.post('/', [validation("Plan")], asyncWrapper(async (req, res) => {
    let plan = req.body;
    let createdPlan = await plansService.create(plan);
    res.send(createdPlan);
}));

router.delete('/:id', asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    await plansService.deleteOne(id);
    res.sendStatus(204);
}));

module.exports = router;