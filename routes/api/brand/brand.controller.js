const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const lineReader = require('line-reader');

// exports.brand = (req, res) => {
// 	lineReader.eachLine('brand.txt', function(line, last) {
// 		console.log(line);
// 		let eng = line.split('@')[0];
// 		let kor = line.split('@')[1];
// 	  	conn.query(
// 		  'INSERT INTO Brands(brand_name, brand_name_kor) VALUES(?, ?)',
// 		  [eng, kor],
// 		  (err, result) => {
// 			  if (err) throw err;
// 		  }
// 	 	)
// 	  if(last){
// 	    // or check if it's the last one
// 		return res.status(200).json({
// 			message: 'input brandlist done'
// 		})
// 	  }
// 	});
// };

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

exports.getOneBrand = (req, res) => {
    const { brand_id } = req.params;
    conn.query(
        "SELECT * FROM Brands WHERE id = ?",
        [brand_id],
        (err, result) => {
            if (err) throw err;
            return res.status(200).json({
                brand: result[0]
            })
        }
    )
}

exports.getRecentItems = (req, res) => {
    conn.query(
        'SELECT * FROM Items join Brands on Brands.id = Items.brand_id join Photos on Photos.item_id = Items.id WHERE first = 1 ORDER BY time DESC LIMIT 10',
        (err, result) => {
            if (err) throw err;
            return res.status(200).json({
                result
            })
        }
    )
}