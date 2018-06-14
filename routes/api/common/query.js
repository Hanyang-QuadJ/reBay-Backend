exports.getItemByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Items WHERE item_id = ${item_id}`, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result[0]);
            }
        });
    });
}

exports.getImageByItemId = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Photos WHERE item_id = ${item_id} and first = 1`, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result[0]);
            }
        });
    });
}

exports.getItemsByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Items WHERE user_id = ${user_id}`, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
}