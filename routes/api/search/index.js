const router = require('express').Router();
const controller = require('./search.controller');

router.post('', controller.search);
router.get('/name', controller.searchByName);
router.get('/category', controller.searchByCategory);

module.exports = router;
