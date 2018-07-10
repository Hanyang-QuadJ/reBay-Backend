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
    try {
        result = await query.createComment(user_id, item_id, comments, score);
        return res.status(200).json({
            message: "success"
        })
    } catch (err) {
        return res.status(400).json(err);
    } 
}

exports.createTemp = async (req, res) => {
    const item_id = req.params;
    try {
        result = await query.createTemp(item_id, req.decoded._id);
        return res.status(200).json({
            message: "success"
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.getTemp = async (req, res) => {
    let err = false;
    user_id = req.decoded._id;
    try {
        const temps = await query.getTempsByUserId(user_id);
        for (temp of temps) {
            temp.item = await query.getItemById(temp.item_id);
            temp.brand = await query.getBrandById(temp.item.brand_id);
            temp.image = await query.getImageByItemId(temp.item_id);
        }
        return res.status(200).json({
            temps
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.deleteTemp = async (req, res) => {
    const {temp_id} = req.params;
    try {
        result = await query.deleteTempById(temp_id);
        return res.status(200).json({
            message: "Success"
        });
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.getSellList = async (req, res) => {
    const user_id = req.decoded._id;
    try {
        const items = await query.getItemsByUserId(user_id);
        for (let item of items) {
            item.image = await query.getImageByItemId(item.id);
        }
        return res.status(200).json({
            items
        })
    } catch (err) {
        return res.status(400).json(err);
    }   
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

exports.itemLikeCancel = async(req, res) => {
    const { item_id } = req.params;
    try {
        const isLiked = await query.checkIsLiked(req.decoded._id, item_id);
        if (isLiked) { // 좋아요가 되어있음
            await query.deleteLikeByUserId(req.decoded._id, item_id);
            return res.status(200).json({
                message: 'Successfully Canceled'
            })
        } else { // 좋아요가 되어있지 않음
            return res.status(200).json({
                isLiked: false
            })
        }
    } catch (err) {
        return res.status(400).json(err);
    }
    
}

exports.itemLikeCheck = async(req, res) => {
    const { item_id } = req.params;
    try {
        const isLiked = await query.checkIsLiked(req.decoded._id, item_id);
        return res.status(200).json({
            isLiked: isLiked
        })
    } catch (err) {
        return res.status(400).json(err);
    }
}

exports.getAskedItems = async(req, res) => {
    const user_id = req.decoded._id;
    try{
        const items = await query.getItemsByUserId(user_id);
        const helps = await query.getHelpsBySellerId(user_id);
        const askedItems = [];
        for(item of items){
            for(help of helps){
                if(item.id === help.item_id){
                    askedItems.push(item);
                    break;
                }
            }
        }
        for(item of askedItems){
            item.image = await query.getImageByItemId(item.id);
        }
        return res.status(200).json(askedItems);
    }
    catch(err) {
        return res.status(400).json(err);
    }
}

exports.getAskItems = async(req, res) => {
    const user_id = req.decoded._id;
    try{
        const helps = await query.getHelpsByUserId(user_id);
        const askItems = [];
        for(help of helps){
            item = await query.getItemById(help.item_id);
            if(askItems.indexOf(item)<0) askItems.push(item);
        }
        for(item of askItems){
            item.image = await query.getImageByItemId(item.id);
        }
        return res.status(200).json(askItems);
    }
    catch(err) {
        return res.status(400).json(err);
    }
}