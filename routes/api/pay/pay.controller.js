const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");

exports.pay = (req, res) => {
    const {item_id} = req.body;
    conn.query(
        `SELECT * FROM Items WHERE id = ${item_id}`,
        (err, item) => {
            item = item[0];
            conn.query(
                'INSERT INTO Buys(item_id, buyer_id, seller_id) VALUES(?, ?, ?)',
                [item.id, req.decoded._id, item.user_id],
                (err, result) => {
                    if (err) throw err;
                    conn.query(
                        `DELETE FROM Items WHERE id=${item_id}`,
                        (err) => {
                            if (err) throw err;
                            return res.status(200).json({
                                message: 'payment successfully added'
                            })
                        }
                    )
                }
            )
        }
    )

}