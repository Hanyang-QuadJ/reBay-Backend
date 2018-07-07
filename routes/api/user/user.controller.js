const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const query = require('../common/query');

exports.me = (req, res) => {
    conn.query(
        'SELECT * FROM Users WHERE id=?',
        [req.decoded._id],
        (err, result) => {
            if (err) throw err;
            return res.status(200).json({
                result
            })
        }
    )
};


exports.buyedlist = async (req, res) => {
    const buys = await query.getBuysByBuyerId(req.decoded._id);
    err = query.errorCheck(buys);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    for (buy of buys) {
        buy.item = await query.getItemById(buy.item_id);
        err = query.errorCheck(buy.item);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
        buy.item.image = await query.getImageByItemId(buy.item_id);
        err = query.errorCheck(buy.item.image);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
    }
    return res.status(200).json({
        buys
    })
}

exports.soldlist = async (req, res) => {
    const buys = await query.getBuysBySellerId(req.decoded._id);
    err = query.errorCheck(buys);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    for (buy of buys) {
        buy.item = await query.getItemById(buy.item_id);
        err = query.errorCheck(buy.item);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
        buy.item.image = await query.getImageByItemId(buy.item_id);
        err = query.errorCheck(buy.item.image);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
    }
    return res.status(200).json({
        buys
    })
}
//========================================================================
//========================================================================
//========================================================================
//========================================================================
//========================================================================
//========================================================================
//========================================================================
//========================================================================
//========================================================================


