const router = require('express').Router();
const controller = require('./buy.controller');

// router.get('/me', controller.me);
// router.get('', controller.buy);
router.post('/register', controller.register);

module.exports = router;
