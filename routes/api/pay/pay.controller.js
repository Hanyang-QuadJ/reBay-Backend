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
    try {
        item = await query.getItemById(item_id);
        await query.createBuy(item.id, user_id, item.user_id);
        await query.patchItemStatusToZero(item.id);
        return res.status(200).json({
            message: 'payment successfully added'
        })
    } catch (err) {
        return res.status(400).json(err);
    }    
}