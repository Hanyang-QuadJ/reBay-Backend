const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");
const query = require("../common/query");

exports.sell = (req, res) => {
    const {
        pic_list,
        item_name,
        price,
        brand_id,
        size,
        season,
        category_1,
        category_2,
        item_status,
        fullbox,
        warantee,
        domestic,
        refund,
        content,
        sub_content,
        tags
    } = req.body;
    const d = new Date();
    d.setUTCHours(d.getUTCHours());
    let pic_input = (result, pic, index) => {
        return new Promise((resolve, reject) => {
            // const d = new Date();
            // d.setUTCHours(d.getUTCHours() + 9);
            let first = false;
            if (index == 0) {
                first = true;
            }
            const picKey = d.getFullYear() + '_'
                + d.getMonth() + '_'
                + d.getDate() + '_'
                + crypto.randomBytes(20).toString('hex') +
                +req.decoded._id + '.jpg';
            const picUrl = `https://s3.ap-northeast-2.amazonaws.com/rebay-image/${picKey}`;
            let buf = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            s3.putObject({
                Bucket: 'rebay-image',
                Key: picKey,
                Body: buf,
                ACL: 'public-read'
            }, function (err, response) {
                if (err) {
                    if (err) reject(err);
                } else {
                    // console.log(response)
                    conn.query('INSERT INTO Photos(item_id, image_url, first) VALUES(?, ?, ?)', [result.insertId, picUrl, first], (err) => {
                        if (err) reject(err);
                        resolve();
                    })
                }
            });
        })
    }

    let tags_input = (result, tags) => {
        return new Promise((resolve, reject) => {
            tags.forEach((tag) => {
                conn.query('INSERT INTO Tags(item_id, title) VALUES(?, ?)', [result.insertId, tag], (err) => {
                    if (err) throw err;
                    resolve();
                })
            })
        })
    }

    async function picandtag_input(result, pic_list, tags) {
        pic_list.forEach(async (pic, index) => {
            await pic_input(result, pic, index);
        });
        await tags_input(result, tags);
        return res.status(200).json({
            item_id: result.insertId
        })
    }

    conn.query(
        `INSERT INTO Items(
			user_id,
			item_name,
			brand_id,
			price,
			size,
			season,
			content,
			sub_content,
			category_1,
			category_2,
			item_status,
			fullbox,
			warantee,
			domestic,
			refund,
			time
		)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            req.decoded._id,
            item_name,
            brand_id,
            price,
            size,
            season,
            content,
            sub_content,
            category_1,
            category_2,
            item_status,
            fullbox,
            warantee,
            domestic,
            refund,
            d
        ],
        (err, result) => {
            if (err) throw err;
            console.log("-----------" + brand_id + "--------------");
            picandtag_input(result, pic_list, tags);
        }
    )
}

exports.writeComments = async (req, res) => {
    const {item_id, comments, score} = req.body;
    const user_id = req.decoded._id;
    result = await query.createComment(user_id, item_id, comments, score);
    err = query.errorCheck(result);
    if (err === true) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message: "success"
    })
}

exports.createTemp = async (req, res) => {
    const item_id = req.params;
    const user_id = req.decoded._id;
    result = await query.createTemp(item_id, user_id);
    err = query.errorCheck(result);
    if (err === true) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message: "success"
    });
}

exports.getTemp = async (req, res) => {
    let err = false;
    user_id = req.decoded._id;
    const temps = await query.getTempsByUserId(user_id);
    err = query.errorCheck(temps);
    if (err === true) {
        return res.status(400).json({
            message: "fail"
        })
    }
    for (temp of temps) {
        item_object = await query.getItemById(temp.item_id);
        temp.category_1 = item_object.category_1;
        temp.category_2 = item_object.category_2;
        temp.content = item_object.content;
        temp.domestic = item_object.domestic;
        temp.fullbox = item_object.fullbox;
        temp.item_id = item_object.id;
        temp.item_name = item_object.item_name;
        temp.item_status = item_object.item_status;
        temp.like_cnt = item_object.like_cnt;
        temp.price = item_object.price;
        err = query.errorCheck(temp.item);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
        brand_object = await query.getBrandById(temp.item.brand_id);
        
        temp.brand_id = brand_object.id;
        temp.brand_name = brand_object.brand_name;
        temp.brand_name_kor = brand_object.brand_name_kor;

        err = query.errorCheck(temp.brand);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
        temp.image_url = await query.getImageByItemId(temp.item_id);

        err = query.errorCheck(temp.image);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
    }
    return res.status(200).json({
        temps
    });
}

exports.deleteTemp = async (req, res) => {
    const {temp_id} = req.params;
    result = await query.deleteTempById(temp_id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message: "Success"
    })
}

exports.getSellList = async (req, res) => {
    const user_id = req.decoded._id;
    const items = await query.getItemsByUserId(user_id);
    err = await query.errorCheck(items);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    for (let item of items) {
        item.image = await query.getImageByItemId(item.id);
        err = query.errorCheck(item.image);
        if (err) {
            return res.status(400).json({
                message: "fail"
            })
        }
    }
    return res.status(200).json({
        items
    })
}

exports.itemLike = (req, res) => {
    const { item_id } = req.params;
    conn.query(
        `UPDATE Items SET like_cnt = like_cnt+1 WHERE id = ${item_id}`,
        (err) => {
            if (err) {
                return res.status(400).json({
                    message: "fail"
                })
            }
            conn.query(
                "INSERT INTO Likes(item_id, user_id) VALUES (?, ?)",
                [item_id, req.decoded._id],
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            message: "fail"
                        })
                    }
                    return res.status(200).json({
                        result
                    })
                }
            )
        }
    )
}