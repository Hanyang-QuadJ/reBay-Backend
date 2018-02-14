const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Item = new Schema({
	itemname: String,
	price: Number,
	comments: [{ comment: String }],
	pictures: [{ picure: String }],
	content: String,
	tags: [{tag: ObjectId, ref: 'Tag'}]
});

module.exports = mongoose.model('Item', Item);
