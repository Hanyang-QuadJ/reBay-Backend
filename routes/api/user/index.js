const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.me);
router.get('/buylist',controller.buyedlist);
router.get('/selllist',controller.soldlist);
module.exports = router;
