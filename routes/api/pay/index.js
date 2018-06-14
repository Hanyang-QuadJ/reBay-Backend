const router = require('express').Router();
const controller = require('./pay.controller');

router.post('', controller.pay);

module.exports = router;
