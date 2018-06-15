const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

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
	conn.query(
		`SELECT * FROM Buys WHERE buyer_id = ${req.decoded._id}`,
		async (err, result)=> {
			for(let i=0;i<result.length;i++){
				console.log(result[i].item_id);
				result[i].item = await getItemById(result[i].item_id);
                result[i].item.image = await getImageByItemId(result[i].item_id);
			}
			return res.status(200).json({
				result
			})
		}
	)
}

exports.soldlist = async (req, res) => {
    conn.query(
        `SELECT * FROM Buys WHERE seller_id = ${req.decoded._id}`,
        async (err, result)=> {
            for(let i=0;i<result.length;i++){
                console.log(result[i].item_id);
                result[i].item = await getItemById(result[i].item_id);
                result[i].item.image = await getImageByItemId(result[i].item_id);
            }
            return res.status(200).json({
                result
            })
        }
    )
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

const getItemByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Items WHERE item_id = ${item_id}`, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result[0]);
            }
        });
    });
}

const getImageByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Photos WHERE item_id = ${item_id} and first = 1`, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result[0]);
            }
        });
    });
}