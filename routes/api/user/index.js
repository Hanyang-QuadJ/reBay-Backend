const router = require('express').Router();
const controller = require('./user.controller');

router.get('/isbuyer', controller.isbuyer);
router.get('/isowner', controller.isowner);

module.exports = router;
