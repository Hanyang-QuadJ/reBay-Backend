const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.me);

module.exports = router;
