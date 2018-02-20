const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const crypto = require('crypto');
const config = require('../../../config');


exports.register = (req, res) => {
	const secret = req.app.get('jwt-secret');
	const { username, email, password, phone, profile_img } = req.body;
	const encrypted = crypto.createHmac('sha1', config.secret)
		.update(password)
		.digest('base64');
	User.findOne({ email: email },(err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (user) return res.status(406).json({ message:'email exists' });
		let newUser = new User({
			email,
			username,
			phone,
			profile_img,
			password: encrypted,
		});
		newUser.save( (err, user) => {
			if (err) return res.status(500).json({ error:err });
			jwt.sign(
				{
					_id: user._id,
					email: user.email,
					username: user.username
				},
				secret,
				{
					expiresIn: '7d',
					issuer: 'rebay_admin',
					subject: 'userInfo'
				}, (err, token) => {
					if (err) return res.status(406).json({ message:'login failed' });
					return res.status(200).json({
						message: 'registered successfully',
						token
					});
				});
		});
	});
};



exports.login = (req, res) => {
	const { email, password } = req.body;
	const secret = req.app.get('jwt-secret');

	User.findOne({ email: email }, (err, user) => {
		if (err) return res.status(500).json({ error: err });
		if (!user) return res.status(406).json({ message:'login failed' });
		const encrypted = crypto.createHmac('sha1', config.secret)
			.update(password)
			.digest('base64');
		if (user.password === encrypted) {
			jwt.sign(
				{
					_id: user._id,
					email: user.email,
					username: user.username
				},
				secret,
				{
					expiresIn: '7d',
					issuer: 'rebay_admin',
					subject: 'userInfo'
				}, (err, token) => {
					if (err) return res.status(406).json({ message:'login failed' });
					return res.status(200).json({
						message: 'logged in successfully',
						token
					});
				});
		} else {
			return res.status(406).json({ message:'login failed' });
		}
	});
};
