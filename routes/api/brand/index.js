const router = require('express').Router();
const controller = require('./brand.controller');

router.post('', controller.brand);
router.get('', controller.getBrandList);
router.get('/one/:brand_id', controller.getOneBrand);

module.exports = router;
