const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");
const query = require("../common/query");

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
	const d = new Date();
	d.setUTCHours(d.getUTCHours());
	let pic_input = (result, pic, index) => {
		return new Promise((resolve, reject) => {
			// const d = new Date();
			// d.setUTCHours(d.getUTCHours() + 9);
			let first = false;
			if (index == 0) {
				first = true;
			}
			const picKey = d.getFullYear() + '_'
				+ d.getMonth() + '_'
				+ d.getDate() + '_'
				+ crypto.randomBytes(20).toString('hex') + 
				+ req.decoded._id + '.jpg';
			const picUrl = `https://s3.ap-northeast-2.amazonaws.com/rebay-image/${picKey}`;
			let buf = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ''), 'base64');
			s3.putObject({
				Bucket: 'rebay-image',
				Key: picKey,
				Body: buf,
				ACL: 'public-read'
			}, function (err, response) {
				if (err) {
					if (err) reject(err);
				} else {
					// console.log(response)
					conn.query('INSERT INTO Photos(item_id, image_url, first) VALUES(?, ?, ?)', [result.insertId, picUrl, first], (err) => {
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
		pic_list.forEach(async (pic, index) => {
			await pic_input(result, pic, index);
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
			refund,
			time
		)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
			refund,
			d
		],
		(err, result) => {
			if (err) throw err;
			console.log("-----------"+brand_id+"--------------");
			picandtag_input(result, pic_list, tags);
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
		'SELECT * FROM Temps JOIN Items on Temps.item_id = Items.id JOIN Brands on Brands.id = Items.brand_id JOIN Photos on Photos.item_id = Items.id WHERE first = 1 AND Temps.user_id = ?',
		[req.decoded._id],
		(err, result) => {
			if (err) throw err;
			return res.json({
				result
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
			return res.status(200).json({
				message: 'temporary item successfully deleted'
			})
		}
	)
}

exports.getSellList = async (req, res) => {
	const user_id = req.decoded._id;
	const items = await query.getItemsByUserId(user_id);
    for (let item of items) {
        item.image = await query.getImageByItemId(item.id);
    }
    return res.status(200).json({
		items
	})
}

