const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const config = require('../../../config');

// 구매 상세정보 등록
exports.register = (req, res) => {
	const { address_main, address_sub, bank_account, bank_name, bank_user } = req.body;
	User.findById(req.decoded._id)
	.exec((err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(406).json({ message:'no such user' });
		user.address_main = address_main
		user.address_sub = address_sub
		user.bank_account = bank_account
		user.bank_name = bank_name
		user.bank_user = bank_user
		user.isBuyer = true
		user.save((err) => {
			if (err) return res.status(500).json({ error: err });
			return res.status(200).json({ message:
				'user information added'
			});
		});
	});
}
