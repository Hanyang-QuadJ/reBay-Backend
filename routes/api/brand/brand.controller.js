const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const lineReader = require('line-reader');

exports.brand = (req, res) => {
	lineReader.eachLine('brand.txt', function(line, last) {
		console.log(line);
	  	conn.query(
		  'INSERT INTO Brands(brand_name, brand_name_kor) VALUES(?, ?)',
		  [line, null],
		  (err, result) => {
			  if (err) throw err;
		  }
	 	)
	  if(last){
	    // or check if it's the last one
		return res.status(200).json({
			message: 'input brandlist done'
		})
	  }
	});
};

exports.getBrandList = (req, res) => {
	conn.query(
		"SELECT * FROM Brands",
		(err, result) => {
			if (err) throw err;
			return res.status(200).json({
				brands: result
			})
		}
	)
}
