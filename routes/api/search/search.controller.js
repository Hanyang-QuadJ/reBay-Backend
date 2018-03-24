const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const config = require("../../../config");
const conn = mysql.createConnection(config);

exports.search = (req, res) => {

    const { category_1, category_2, item_status, season, max_price, min_price, index } = req.body;
    let sql = "SELECT * FROM Items join Photos on (Items.id = Photos.item_id and Photos.first = 1 ) WHERE ";

    if (category_1 == '상관없음') {
        sql += 'category_1 is not null and '
    } else if (category_1 != '상관없음') {
        sql += `category_1 = '${category_1}' and `
    }
    if (category_2 == '상관없음') {
        sql += 'category_2 is not null and '
    } else if (category_2 != '상관없음') {
        sql += `category_2 = '${category_2}' and `
    }
    if (item_status == '상관없음') {
        sql += 'item_status is not null and '
    } else if (item_status != '상관없음') {
        sql += `item_status = '${item_status}' and `
    }
    if (season == '상관없음') {
        sql += 'season is not null and '
    } else if (season != '상관없음') {
        sql += `season = '${season}' and `
    }
    if (brand_id == '상관없음') {
        sql += 'brand_id is not null and '
    } else if (brand_id != '상관없음') {
        sql += `brand_id = '${brand_id}' and `
    }
    sql += `price >= ${min_price} and price <= ${max_price} ORDER BY Items.id DESC LIMIT 10 OFFSET ${index};`
    conn.query(
        sql,
        (err, result) => {
            if (err) throw err;
            return res.status(200).json({
                nextIndex: parseInt(index) + 10,
                result
            })
        }
    )
}

