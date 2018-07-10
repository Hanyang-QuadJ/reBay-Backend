const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const config = require("../../../config");
const conn = mysql.createConnection(config);

let getTags = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Tags WHERE item_id = ?",
            [item_id],
            (err, result) => {
                if (err) reject();
                resolve(result);
            }
        )
    })
}
let getImages = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Photos WHERE item_id = ?",
            [item_id],
            (err, result) => {
                if (err) reject();
                resolve(result);
            }
        )
    })
}
exports.search = (req, res) => {

    const { brand_id, category_1, category_2, item_status, season, max_price, min_price, index, condition } = req.body;
    let sql = "SELECT * FROM Items join Photos on (Items.id = Photos.item_id and Photos.first = 1 ) WHERE ";
    if (condition == 0) {
        condition_str = "Items.price ASC"
    } else if (condition == 1) {
        condition_str = "Items.price DESC"
    } else if (condition == 2) {
        condition_str = "Items.time ASC"
    } else if (condition == 3) {
        condition_str = "Items.time DESC"
    }
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
    sql += `price >= ${min_price} and price <= ${max_price} ORDER BY ${condition_str} LIMIT 20 OFFSET ${index};`
    conn.query(
        sql,
        (err, result) => {
            if (err) throw err;
            return res.status(200).json({
                nextIndex: parseInt(index) + parseInt(result.length),
                result
            })
        }
    )
}

exports.searchByName = (req, res) => {
    conn.query(
        `SELECT * FROM Items WHERE item_name LIKE '%${req.query.name}%'`,
        async (err, result) => {
            if (err) return res.status(406).json({ err });
            for (let i = 0; i < result.length; i++) {
                result[i].tags = await getTags(result[i].id);
                result[i].images = await getImages(result[i].id);
            }
            await res.status(200).json({
                result
            })
        }
    )
}

exports.searchByCategory = (req, res) => {
    conn.query(
        `SELECT * FROM Items WHERE category_1 LIKE '%${req.query.category}%'`,
        async (err, result) => {
            if (err) return res.status(406).json({ err });
            if (result.length == 0) {
                conn.query(
                    `SELECT * FROM Items WHERE category_2 LIKE '%${req.query.category}%'`,
                    async (err, result) => {
                        if (err) return res.status(406).json({ err });
                        for (let i = 0; i < result.length; i++) {
                            result[i].tags = await getTags(result[i].id);
                            result[i].images = await getImages(result[i].id);
                        }
                        await res.status(200).json({
                            result
                        })
                    }
                )
            } else {
                for (let i = 0; i < result.length; i++) {
                    result[i].tags = await getTags(result[i].id);
                    result[i].images = await getImages(result[i].id);
                }
                await res.status(200).json({
                    result
                })
            }
        }
    )
}

exports.serachByBrandName = (req, res) => {
    conn.query(
        `SELECT Items.id as id, item_name, price, size, season, content, sub_content, category_1, category_2, item_status, fullbox, warantee, domestic, refund, time, Brands.id as brand_id,  brand_name, brand_name_kor FROM Items JOIN Brands WHERE Items.brand_id = Brands.id and (brand_name LIKE '%${req.query.name}%' or brand_name_kor LIKE '%${req.query.name}%')`,
        async (err, result) => {
            if (err) return res.status(406).json({ err });
            for (let i = 0; i < result.length; i++) {
                result[i].tags = await getTags(result[i].id);
                result[i].images = await getImages(result[i].id);
            }
            await res.status(200).json({
                result
            })
        }
    )
}

exports.searchByTagName = (req, res) => {
    conn.query(
        `SELECT Items.id, Tags.title as tag_title, Items.user_id, Items.item_name, brand_id, price, size, season, content, sub_content, category_1, category_2, item_status, fullbox, warantee, domestic, refund, time, status FROM Tags JOIN Items ON Tags.item_id = Items.id WHERE Tags.title = '${req.query.name}'`,
        async (err, result) => {
            if (err) return res.status(406).json({ err });
            for (let i = 0; i < result.length; i++) {
                result[i].tags = await getTags(result[i].id);
                result[i].images = await getImages(result[i].id);
            }
            await res.status(200).json({
                result
            })
        }
    )
}
