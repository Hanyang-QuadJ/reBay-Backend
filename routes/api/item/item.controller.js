const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();

exports.sell = (req, res) => {
	const {
		pic_list,
		item_name,
		price,
		brand_id,
		size,
		season,
		category_1,
		category_2,
		item_status,
		fullbox,
		warantee,
		domestic,
		refund,
		content,
		sub_content,
		tags
	} = req.body;

	let pic_input = (result, pic) => {
		return new Promise((resolve, reject) => {
			const d = new Date();
			d.setUTCHours(d.getUTCHours() + 9);
			const picKey = d.getFullYear() + '_'
				+ d.getMonth() + '_'
				+ d.getDate() + '_'
				+ d.getTime() + '_'
				+ d.getSeconds() + '_'
				+ req.decoded._id + '.jpg';
			const picUrl = `https://s3.ap-northeast-2.amazonaws.com/rebay-image/${picKey}`;
			let buf = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ''), 'base64');
			s3.putObject({
				Bucket: 'rebay-image',
				Key: picKey,
				Body: buf,
				ACL: 'public-read'
			}, function (err) {
				if (err) {
					if (err) reject(err);
				} else {
					conn.query('INSERT INTO Photos(item_id, image_url) VALUES(?, ?)', [result.insertId, picUrl], (err) => {
						if (err) reject(err);
						resolve();
					})
				}
			});
		})
	}

	let tags_input = (result, tags) => {
		return new Promise((resolve, reject) => {
			tags.forEach((tag) => {
				conn.query('INSERT INTO Tags(item_id, title) VALUES(?, ?)',[result.insertId, tag],(err) => {
					if (err) throw err;
					resolve();
				})
			})
		})
	}

	async function picandtag_input(result, pic_list, tags) {
		pic_list.forEach(async (pic) => {
			await pic_input(result, pic);
		});
		await tags_input(result, tags);
		return res.status(200).json({
			item_id: result.insertId
		})
	}

	conn.query(
		`INSERT INTO Items(
			user_id,
			item_name,
			brand_id,
			price,
			size,
			season,
			content,
			sub_content,
			category_1,
			category_2,
			item_status,
			fullbox,
			warantee,
			domestic,
			refund
		)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			req.decoded._id,
			item_name,
			brand_id,
			price,
			size,
			season,
			content,
			sub_content,
			category_1,
			category_2,
			item_status,
			fullbox,
			warantee,
			domestic,
			refund
		],
		(err, result) => {
			if (err) throw err;
			picandtag_input(result, pic_list, tags);
		}
	)
}

exports.getOneItem = (req, res) => {
	const { item_id } = req.params;
	conn.query(
		'select * from Users, Items where Users.id = Items.user_id and Items.id = ?',
		[item_id],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				item: result[0]
			})
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

exports.writeComments = (req, res) => {
	const { item_id, comments, score } = req.body;
	conn.query(
		'INSERT INTO Comments(user_id, item_id, comments, score) VALUES(?, ?, ?, ?)',
		[req.decoded._id, item_id, comments, score],
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				message: 'comment successfully added'
			})
		}
	)
}

exports.createTemp = (req, res) => {
	const { item_id } = req.params;
	conn.query(
		'INSERT INTO Temps(item_id, user_id) VALUES(?, ?)',
		[item_id, req.decoded._id],
		(err, result) => {
			if (err) throw err;
			return res.json({
				message: 'temporary item successfully saved'
			})
		}
	)
}

exports.getTemp = (req, res) => {
	conn.query(
		'SELECT * FROM Temps WHERE Temps.user_id = ?',
		[req.decoded._id],
		(err, result) => {
			if (err) throw err;
			return res.json({
				temps: result
			})
		}
	)
}

exports.deleteTemp = (req, res) => {
	const { temp_id } = req.params;
	conn.query(
		'DELETE FROM Temps WHERE id = ?',
		[temp_id],
		(err, result) => {
			if (err) throw err;
			return res.json({
				message: 'temporary item successfully deleted'
			})
		}
	)
}
