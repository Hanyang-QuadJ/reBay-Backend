const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const json = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
exports.errorCheck = (obj) => {
    console.log(obj.err);
    if (obj.err) return true;
    else return false;
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
        conn.query(`INSERT INTO Temps(item_id, user_id) VALUES(${item_id}, ${user_id})`, (err, result) => {
            if (err) resolve({err: err});
            else {
                resolve({result: 1});
            }
        });
    });
}

exports.createComment = (user_id, item_id, comments, score) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Comments(user_id, item_id, comments, score) 
        VALUES(${user_id}, ${item_id},'${comments}',${score})`,
            (err, result) => {
                if (err) resolve({err: err});
                else {
                    resolve({result: 1});
                }
            });
    });
}

exports.createBuy = (item_id, buyer_id, seller_id) => {
    return new Promise(resolve => {
        conn.query(
            'INSERT INTO Buys(item_id, buyer_id, seller_id) VALUES(?, ?, ?)',
            [item_id, buyer_id, seller_id],
            (err, result) => {
                if (err) resolve({err: err});
                else resolve({result: 1});
            }
        )
    });
}

exports.createHelp = (user_id, ask,seller_id) => {
    return new Promise(resolve => {
        conn.query(
            'INSERT INTO Helps(user_id, ask,seller_id) VALUES(?, ?, ?)',
            [user_id, ask, seller_id],
            (err, result) => {
                if (err) resolve({err: err});
                else resolve({result: 1});
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
exports.getUserByUserId = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Users WHERE id = ${id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result[0]);
            }
        });
    });
}

exports.getBrandById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Brands WHERE id = ${id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result[0]);
            }
        });
    });
}
exports.getTempsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Temps WHERE user_id = ${user_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result);
            }
        });
    });
}
exports.getItemById = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Items WHERE id = ${item_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result[0]);
            }
        });
    });
}

exports.getImageByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Photos WHERE item_id = ${item_id} and first = 1`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result[0]);
            }
        });
    });
}

exports.getItemsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        console.log(user_id);
        conn.query(`SELECT * FROM Items WHERE user_id = ${user_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result);
            }
        });
    });
}

exports.getBuysByBuyerId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Buys WHERE buyer_id = ${user_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result);
            }
        });
    });
}

exports.getBuysBySellerId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Buys WHERE seller_id = ${user_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result);
            }
        });
    });
}

exports.getHelpsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE user_id = ${user_id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result);
            }
        });
    });
}

exports.getHelpById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Helps WHERE id = ${id}`, (err, result) => {
            if (err) resolve({err: err});
            if (result.length === 0) resolve([]);
            else {
                resolve(result[0]);
            }
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
            if (err) resolve({err: err});
            else {
                resolve({result: 1});
            }
        });
    })
}

exports.patchHelps = (id, ask, answer) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Helps SET ask = '${ask}', answer='${answer}' WHERE id=${id}`, (err, result) => {
            if (err) resolve({err: err});
            else {
                resolve({result: 1});
            }
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
            if (err) resolve({err: err});
            else {
                resolve(result);
            }
        });
    })
}

exports.deleteItemById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Items WHERE id = ${id}`, (err, result) => {
            if (err) resolve({err: err});
            else {
                resolve(result);
            }
        });
    })
}

exports.deleteHelpById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Helps WHERE id = ${id}`, (err, result) => {
            if (err) resolve({err: err});
            else {
                resolve(result);
            }
        });
    })
}
