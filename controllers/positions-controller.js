const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const PositionService = require('../services/position-service');
const validation = require('../middleware/validator');

const positionService = new PositionService();

router.get('/', asyncWrapper(async (req, res) => {
    let positions = await positionService.findAll();
    res.send(positions);
}));

router.get('/:id', [validation("Position","id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    let position = await positionService.findOne(id);
    res.send(position);
}));

router.post('/', [validation("Position")], asyncWrapper(async (req, res) => {
    let position = req.body;
    let positionPlan = await positionService.create(position);
    res.send(positionPlan);
}));

router.delete('/:id', [validation("Position","id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    await positionService.deleteOne(id);
    res.sendStatus(204);
}));

module.exports = router;