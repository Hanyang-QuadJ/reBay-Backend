const router = require('express').Router();
const controller = require('./buy.controller');

router.post('/register', controller.register);

module.exports = router;
