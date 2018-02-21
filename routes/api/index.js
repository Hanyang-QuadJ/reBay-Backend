const router = require('express').Router();

const auth = require('./auth');
const user = require('./user');
const brand = require('./brand');
const buy = require('./buy');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/brand', brand);

router.use('/buy', authMiddleware);
router.use('/buy', buy);

module.exports = router;
