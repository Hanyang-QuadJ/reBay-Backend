const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
	// 상태체크
	isOwner: {type: Boolean, default: false},
	isBuyer: {type: Boolean, default: false},

	// 필수입력
	username: {type: String, required: true},
	email: {type: String, required: true},
	nickname: {type: String, required: true},
	password: {type: String, required: true},
	phone: {type: Number, required: true},
	profile_img: {type: String, default: 'http://www.piachievers.com/img/users-male-2.png'},

	// 부가정보
	address_main: {type: String, default: null},
	address_sub: {type: String, default: null},
	bank_account: {type: String, default: null},
	bank_name: {type: String, default: null},
	bank_user: {type: String, default: null},

  	// 사업자정보
	owner_name: {type: String, default: null},
	store_name: {type: String, default: null},
	store_address: {type: String, default: null},
	store_sub_address: {type: String, default: null},
	store_number: {type: String, default: null},
	tongshin_number: {type: String, default: null},
	store_type: {type: String, default: null},
	open_date: {type: Date, default: null},
	store_profile: {type: String, default: null},
	store_email: {type: String, default: null},

  	// 개인정보
	shopping_list: [{ type: ObjectId, ref: 'Item' }],
	selling_list: [{type: ObjectId, ref: 'Item'}],
	owner_rank: {type: Number, default: null},
	join_date: {type: Date, default: null},
	owner_level: {type: String, default: '브론즈'},

	// 임시장바구니
	shopping_cart: [{ type: ObjectId, ref: 'Item' }]
});


module.exports = mongoose.model('User', User);
