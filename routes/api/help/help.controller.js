const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");
const query = require("../common/query");
var FCM = require('fcm-node');
var serverKey = 'AAAAyS0H1u0:APA91bFX9VjAXOe6hGbGu7CvRQg_qRZzFdOjwY_qper2qVxpiY6P-LEb5KLk_Rh96r0N9iD_NVm6yAwxzIqUZ702_wDQ2RZiNzBS9XdD3Ckf1L_bPxXHERiFmeT58g4REHGPZmT0If8G'; //put your server key here
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'cZTG3Ch7RGQ:APA91bGhYr89_ywkzUB4da1uogHThZyr4eX1ut42RAIlPN6ik9OSSzc4xmJ9EayONQubCesxFaOlVpb0uuOL79YJ6Wu0UVhIOLUesivFUxeSxWxkDSqY3ivK3ULyomszyHzXmdGt8pkL',
    collapse_key: 'your_collapse_key',

    notification: {
        title: 'Rebay',
        body: '신현종님의 Gucci가방이 성공적으로 판매완료 되었습니다.'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

exports.createHelp = async (req, res) => {
    const {ask, seller_id, item_id} = req.body;
    item = await query.getItemById(item_id);
    err = query.errorCheck(item);
    if (err) {
        return res.status(400).json({
            message: "getItemById Fail"
        })
    }
    user = await query.getUserByUserId(seller_id);
    err = query.errorCheck(user);
    if (err) {
        return res.status(400).json({
            message: "getUserByUserId Fail"
        })
    }
    message.to = user.fcm_token;
    message.notification.body = item.item_name+" 물건에 누군가 상담을 요청했습니다.";
    result = await query.createHelp(req.decoded._id, ask, seller_id, item_id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "createHelp Fail"
        })
    }
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
            return res.status(200).json({
                message:"success"
            })
        }
    });
}

exports.getHelps = async (req, res) => {

    helps = await query.getHelpsByUserId(req.decoded._id);
    err = query.errorCheck(helps);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        helps
    })
}

exports.getHelpById = async (req, res) => {
    const {id} = req.params;
    help = await query.getHelpById(id);
    err = query.errorCheck(help);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        help
    })
}

exports.modifyHelp = async (req, res) => {
    const {id, ask, answer} = req.body;
    result = await query.patchHelps(id,ask,answer);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message:"success"
    })
}

exports.deleteHelp = async (req, res) => {
    const {id} = req.params;
    result = await query.deleteHelpById(id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message:"success"
    })
}