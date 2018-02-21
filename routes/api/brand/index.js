const router = require('express').Router();
const controller = require('./brand.controller');

router.post('', controller.brand);
router.get('', controller.getBrandList);

module.exports = router;
