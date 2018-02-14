const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Log = new Schema({
	seller: {type: ObjectId, ref: 'User'},
	buyer: {type: ObjectId, ref: 'User'},
	item: {type: ObjectId, ref: 'Item'}
	sell_date: Date
});

module.exports = mongoose.model('Log', Log);
