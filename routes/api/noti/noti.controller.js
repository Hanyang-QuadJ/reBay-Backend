const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const crypto = require("crypto");

exports.makeNoti = (user_id, item_id, help_id) => {
  
}