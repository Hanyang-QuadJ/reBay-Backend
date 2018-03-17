const router = require('express').Router();
const controller = require('./item.controller');

router.post('/sell', controller.sell);
router.get('/one/:item_id', controller.getOneItem);

router.get('/all', controller.getSellList);


router.post('/comments', controller.writeComments);
router.get('/comments/:item_id', controller.getComments);

router.post('/temp/:item_id', controller.createTemp);
router.get('/temp', controller.getTemp);
router.delete('/temp/:temp_id', controller.deleteTemp);

router.get('/pic/:item_id', controller.getPictureList);

module.exports = router;
