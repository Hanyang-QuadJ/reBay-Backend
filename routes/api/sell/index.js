const router = require('express').Router();
const controller = require('./sell.controller');

router.post('', controller.sell);
// router.get('/sell', controller.sell);

module.exports = router;
