const router = require('express').Router();
const controller = require('./auth.controller');

router.get('/me', controller.me);

router.post('/register', controller.register);

router.post('/login', controller.login);


module.exports = router;
