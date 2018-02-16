const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const config = require('../../../config');


exports.isbuyer = (req, res) => {
	User.findById(req.decoded._id)
	.exec((err, user, next) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(406).json({ message:'no such user' });
		if (user.isBuyer) {
			return res.status(200).json({
				message : 'user is a buyer'
			})
		} else {
			return res.status(406).json({
				message: 'user is not a buyer'
			})
		}
	});
};

exports.isowner = (req, res) => {
	User.findById(req.decoded._id)
	.exec((err, user, next) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(406).json({ message:'no such user' });
		if (user.isOwner) {
			return res.status(200).json({
				message : 'user is a owner'
			})
		} else {
			return res.status(406).json({
				message: 'user is not a owner'
			})
		}
	});
};;
