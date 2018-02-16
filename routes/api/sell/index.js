const router = require('express').Router();
const controller = require('./sell.controller');

// router.get('/me', controller.me);
router.get('', controller.sell);

module.exports = router;
