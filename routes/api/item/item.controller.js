const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

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

	let piclist_input = (result, pic_list) => {
		return new Promise((resolve, reject) => {
			pic_list.forEach((pic) => {
				conn.query('INSERT INTO Photos(item_id, image_url) VALUES(?, ?)',[result.insertId, pic],(err) => {
					if (err) reject(err);
					resolve();
				})
			})
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
		await piclist_input(result, pic_list);
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
