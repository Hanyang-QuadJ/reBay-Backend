const router = require('express').Router();
const controller = require('./search.controller');

router.post('', controller.search);

router.post('', controller.searchByPriceA);
router.post('', controller.searchByPriceD);

router.post('', controller.searchByDateA);
router.post('', controller.searchByDateD);

// router.post('', controller.searchByPriceA);
// router.post('', controller.searchByPriceD);

module.exports = router;
