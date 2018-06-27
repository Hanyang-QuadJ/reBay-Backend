const router = require('express').Router();
const controller = require('./help.controller');

router.post('', controller.createHelp);
router.delete('/:id', controller.deleteHelp);
router.patch('', controller.modifyHelp);
router.get('', controller.getHelps);
router.get('/:id', controller.getHelpById);
module.exports = router;