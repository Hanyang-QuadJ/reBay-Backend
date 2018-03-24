const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");

exports.getOneItem = (req, res) => {
	const { item_id } = req.params;
	conn.query(
		'select * from Users, Items where Users.id = Items.user_id and Items.id = ?',
		[item_id],
		(err, result1) => {
			if (err) throw err;
			conn.query(
				'SELECT brand_name FROM Brands WHERE id = ?',
				[result1[0].brand_id],
				(err, result2) => {
					if (err) throw err;
					conn.query(
						'SELECT * FROM Tags WHERE item_id = ?',
						[item_id],
						(err, result3) => {
							return res.status(200).json({
								item: result1[0],
								brand_name: result2[0],
								tags: [result3]
							})
						}
					)
				}
			)
		}
	)
}

exports.getComments = (req, res) => {
	const { item_id } = req.params;
	conn.query(
		'SELECT * FROM Comments, Users WHERE Users.id = Comments.user_id and item_id = ?',
		[item_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				comments: result
			})
		}
	)
}

exports.getPictureList = (req, res) => {
	const { item_id } = req.params;
	conn.query(
		'SELECT * FROM Photos WHERE item_id = ?',
		[item_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				result
			})
		}
	)
}

