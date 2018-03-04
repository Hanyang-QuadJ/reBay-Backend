const router = require('express').Router();
const controller = require('./search.controller');

router.post('', controller.search);

module.exports = router;
