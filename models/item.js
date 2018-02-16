const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Item = new Schema({
	done: {type: Boolean, default: false},
	item_name: String,
	brand: String,
	price: Number,
	size: String,
	season: String,
	big_category: String,
	middle_category: String,
	small_category: String,
	status: String,
	is_fullbox: Boolean,
	is_warantee: Boolean,
	country: String,
	fundable: String,
	comments: [{ comment: String }],
	pictures: [{ picure: String }],
	content: String,
	extra_content: String,
	tags: [{tag: ObjectId, ref: 'Tag'}],
	open_date: Date,
	like_cnt: Number
});

module.exports = mongoose.model('Item', Item);
