const router = require('express').Router();
const controller = require('./help.controller');

router.post('', controller.createHelp);
router.delete('/:id', controller.deleteHelp);
router.patch('', controller.modifyHelp);
router.get('', controller.getHelps);
router.get('/sell/:id', controller.getHelpsBySellerId);
router.get('/item/:item_id', controller.getHelpsByItemId);
router.get('/:id', controller.getHelpById);


module.exports = router;