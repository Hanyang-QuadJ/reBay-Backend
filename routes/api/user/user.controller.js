const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const crypto = require('crypto');
const config = require('../../../config');


exports.me = (req, res) => {
	User.findById(req.decoded._id)
	.exec((err, user, next) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(406).json({ message:'login failed' });
		return res.status(200).json({
			user: user
		})
	});
};
