const router = require('express').Router();
const controller = require('./item.controller');

router.post('/sell', controller.sell);
router.get('/one/:item_id', controller.getOneItem);

module.exports = router;
