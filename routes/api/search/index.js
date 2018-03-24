const router = require('express').Router();
const controller = require('./search.controller');

router.post('', controller.search);

router.post('/price/ascend', controller.searchByPriceA);
router.post('/price/descend', controller.searchByPriceD);

router.post('/date/ascend', controller.searchByDateA);
router.post('/date/descend', controller.searchByDateD);

// router.post('', controller.searchByPriceA);
// router.post('', controller.searchByPriceD);

module.exports = router;
