const router = require('express').Router();

const auth = require('./auth');
const user = require('./user');
const brand = require('./brand');
const item = require('./item');
const search = require('./search');
const no_token = require('./no_token');

const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);

router.use('/user', authMiddleware);
router.use('/user', user);

// router.use('/brand', authMiddleware);
router.use('/brand', brand);

router.use('/item', authMiddleware);
router.use('/item', item);

// router.use('/search', authMiddleware);
router.use('/search', search);

router.use('/notoken', no_token);


module.exports = router;
