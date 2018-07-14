const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const crypto = require("crypto");
const query = require("../common/query");

exports.createNotification = async (req, res) => {
    const {type, item_id, message} = req.body;
    try {
        await query.createNotification(type, req.decoded._id, item_id, message);
        return res.status(200).json({
            message: 'success'
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.getNotificationsByUserId = async(req, res) => {
    const user_id = req.decoded._id;
    try {
        const notifications = await query.getNotificationsByUserId(user_id);
        const newNotifications = [];
        for(notification of notifications){
            if(notification.viewed === 0){
                newNotifications.push(notification);
            }
        }
        return res.status(200).json(newNotifications);
    } catch (err) {
        return res.status(400).json(err);
    }
}
exports.getCountOfNotificationsByUserId = async(req, res) => {
    const user_id = req.decoded._id;
    try {
        const notifications = await query.getNotificationsByUserId(user_id);
        const newNotifications = [];
        for(notification of notifications){
            if(notification.viewed === 0){
                newNotifications.push(notification);
            }
        }
        return res.status(200).json({count:newNotifications.length});
    } catch (err) {
        return res.status(400).json(err);
    }
}
exports.patchNotificationToViewed = async(req, res) => {
    const {id} = req.params;
    try {
        await query.patchNotificationById(id);
        return res.status(200).json({message:"success"});
    } catch (err) {
        return res.status(400).json(err);
    }
}