const router = require('express').Router();
const controller = require('./help.controller');

router.post('', controller.createHelp);
router.delete('/:id', controller.deleteHelp);
router.patch('/answer', controller.patchAnswerToHelpByHelpId);
router.get('', controller.getHelps);
router.get('/sell/:id', controller.getHelpsBySellerId);
router.get('/item/me/:item_id', controller.getHelpsByItemIdOfMe);
router.get('/item/:item_id', controller.getHelpsByItemId);
router.get('/:id', controller.getHelpById);


module.exports = router;