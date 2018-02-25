const router = require('express').Router();

const auth = require('./auth');
const user = require('./user');
const brand = require('./brand');
const sell = require('./sell');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

router.use('/brand', authMiddleware);
router.use('/brand', brand);

router.use('/sell', authMiddleware);
router.use('/sell', sell);


module.exports = router;
