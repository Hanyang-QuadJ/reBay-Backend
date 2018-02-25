const router = require('express').Router();
const controller = require('./item.controller');

router.post('/sell', controller.sell);
// router.get('/sell', controller.sell);

module.exports = router;
