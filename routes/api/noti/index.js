const router = require('express').Router();
const controller = require('./noti.controller');

router.post('', controller.createNotification);
router.get('', controller.getNotificationsByUserId);
router.get('/count', controller.getCountOfNotificationsByUserId);
router.patch('/:id', controller.patchNotificationToViewed);

module.exports = router;
