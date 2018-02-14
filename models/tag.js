const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Tag = new Schema({
	title: String
});

module.exports = mongoose.model('Tag', Tag);
