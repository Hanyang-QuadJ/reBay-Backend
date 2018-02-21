const jwt = require('jsonwebtoken');
const config = require('../../../config');

// 구매 상세정보 등록
exports.register = (req, res) => {
	const { address_main, address_sub, bank_account, bank_name, bank_user } = req.body;
	
}
