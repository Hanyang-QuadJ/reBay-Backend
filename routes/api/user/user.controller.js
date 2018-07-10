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
            if (err) return res.status(400).json(err);
            return res.status(200).json({
                result
            })
        }
    )
};


exports.buyedlist = async (req, res) => {
    try {
        await query.getBuysByBuyerId(req.decoded._id);
        for (buy of buys) {
            buy.item = await query.getItemById(buy.item_id);
            buy.item.image = await query.getImageByItemId(buy.item_id);
        }
        return res.status(200).json({
            buys
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.soldlist = async (req, res) => {
    try {
        await query.getBuysBySellerId(req.decoded._id);
        for (buy of buys) {
            buy.item = await query.getItemById(buy.item_id);
            buy.item.image = await query.getImageByItemId(buy.item_id);
        }
        return res.status(200).json({
            buys
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}