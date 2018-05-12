const router = require('express').Router();
const controller = require('./no_token.controller');

router.get('/one/:item_id', controller.getOneItem);
router.get('/comments/:item_id', controller.getComments);
router.get('/pic/:item_id', controller.getPictureList);
router.get('/user/:user_id', controller.getUserById);

module.exports = router;
