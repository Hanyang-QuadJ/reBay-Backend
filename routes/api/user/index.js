const router = require('express').Router();
const controller = require('./user.controller');

router.get('/me', controller.me);
router.get('/buylist',controller.buyedlist);
router.get('/selllist',controller.soldlist);
router.get('/follower', controller.getFollowers);
router.get('/following', controller.getFollowings);
router.post('/profile', controller.profileImageUpload);
router.patch('/profile', controller.profileImageUpdate);

router.get('/:user_id', controller.getUserById);
router.post('/follow/:user_id', controller.createFollowingByUserId);

module.exports = router;
