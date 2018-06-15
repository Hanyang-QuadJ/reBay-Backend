const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");
const query = require("../common/query");
exports.pay = async (req, res) => {
    const {item_id} = req.body;
    const user_id = req.decoded._id;
    item = await query.getItemById(item_id);
    err = query.errorCheck(item);
    if (err || item.length === 0) {
        return res.status(400).json({
            message: "fail"
        })
    }
    result = await query.createBuy(item.id, user_id, item.user_id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    result = await query.deleteItemById(item.id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message: 'payment successfully added'
    })
}