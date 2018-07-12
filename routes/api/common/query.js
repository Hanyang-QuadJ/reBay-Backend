const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const FCM = require('fcm-node');
const serverKey = 'AAAAyS0H1u0:APA91bFX9VjAXOe6hGbGu7CvRQg_qRZzFdOjwY_qper2qVxpiY6P-LEb5KLk_Rh96r0N9iD_NVm6yAwxzIqUZ702_wDQ2RZiNzBS9XdD3Ckf1L_bPxXHERiFmeT58g4REHGPZmT0If8G'; //put your server key here
const fcm = new FCM(serverKey);
const json = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

exports.sendMessage = (token, body) => {
    const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        collapse_key: 'your_collapse_key',
        notification: {
            title: 'Rebay',
            body: body
        },
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    return new Promise((resolve, reject) => {
        fcm.send(message, function (err, response) {
            if (err) reject(err);
            else {
                resolve(true);
            }
        });
    })
}

//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create-----------------------------------------------
//-----------------------------------------------create--------------------------------------------------
exports.createTemp = (item_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Temps(item_id, user_id) VALUES(${item_id}, ${user_id})`, (err, result) =>  {
            if (err) reject(err);
            else {
                resolve(true);
            }
        });
    });
}

exports.createComment = (user_id, item_id, comments, score) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Comments(user_id, item_id, comments, score) 
        VALUES(${user_id}, ${item_id},'${comments}',${score})`,
            (err, result) => {
                if (err) reject(err);
                else resolve(true);
            });
    });
}

exports.createBuy = (item_id, buyer_id, seller_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO Buys(item_id, buyer_id, seller_id) VALUES(?, ?, ?)',
            [item_id, buyer_id, seller_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(true);
            }
        )
    });
}

exports.createHelp = (user_id, ask, seller_id, item_id) => {
    const d = new Date();
    d.setUTCHours(d.getUTCHours());
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO Helps(user_id, ask,seller_id, item_id, time) VALUES(?, ?, ?, ?, ?)',
            [user_id, ask, seller_id, item_id, d],
            (err, result) => {
                if (err) reject(err);
                else resolve(true);
            }
        )
    });
}

exports.createLike = (item_id, user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO Likes(item_id, user_id) VALUES(?, ?)',
            [item_id, user_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(true);
            }
        )
    });
}
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
//-----------------------------------------------get-----------------------------------------------
exports.checkIsLiked = (user_id, item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT * FROM Likes WHERE user_id = ? and item_id = ?",
            [user_id, item_id],
            (err, result) => {
                if (err) reject(err);
                else if (result.length === 0) resolve(false);
                else {
                    resolve(true);
                }
            }
        )
    })
}

exports.getUserByUserId = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Users WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0])
        });
    });
}

exports.getBrandById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Brands WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0])
        });
    });
}
exports.getTempsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Temps WHERE user_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
exports.getItemById = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Items WHERE id = ${item_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
}

exports.getImageByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Photos WHERE item_id = ${item_id} and first = 1`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
}

exports.getItemsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        // console.log(user_id);
        conn.query(`SELECT * FROM Items WHERE user_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

exports.getBuysByBuyerId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Buys WHERE buyer_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

exports.getBuysBySellerId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Buys WHERE seller_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

exports.getHelpsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE user_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

exports.getHelpById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
}

exports.getHelpsBySellerId = (seller_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE seller_id= ${seller_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

exports.getHelpsByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE item_id= ${item_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
//-----------------------------------------------UPDATE-----------------------------------------------
exports.patchItemStatusToZero = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Items SET status=0 WHERE id=${item_id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}

exports.patchHelps = (id, ask, answer) => {
    const d = new Date();
    d.setUTCHours(d.getUTCHours());
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Helps SET ask = '${ask}', answer='${answer}', time_ans=${d} WHERE id=${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}

exports.patchItem = (id, status, like_cnt) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Items SET status = ${status}, like_cnt=${like_cnt} WHERE id=${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
//-----------------------------------------------delete-----------------------------------------------
exports.deleteTempById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Temps WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}

exports.deleteItemById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Items WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}

exports.deleteHelpById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Helps WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(true);
        });
    })
}
exports.deleteLikeByUserId = (user_id, item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "DELETE FROM Likes WHERE user_id = ? and item_id = ?",
            [user_id, item_id],
            (err) => {
                if (err) reject(err);
                else resolve(true);
            }
        )
    })
}