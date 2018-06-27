const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require("crypto");
const query = require("../common/query");

exports.createHelp = async (req, res) => {
    const {ask} = req.body;
    result = await query.createHelp(req.decoded._id, ask);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message:"success"
    })
}

exports.getHelps = async (req, res) => {

    helps = await query.getHelpsByUserId(req.decoded._id);
    err = query.errorCheck(helps);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        helps
    })
}

exports.getHelpById = async (req, res) => {
    const {id} = req.params;
    help = await query.getHelpById(id);
    err = query.errorCheck(help);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        help
    })
}

exports.modifyHelp = async (req, res) => {
    const {id, ask, answer} = req.body;
    result = await query.patchHelps(id,ask,answer);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message:"success"
    })
}

exports.deleteHelp = async (req, res) => {
    const {id} = req.params;
    result = await query.deleteHelpById(id);
    err = query.errorCheck(result);
    if (err) {
        return res.status(400).json({
            message: "fail"
        })
    }
    return res.status(200).json({
        message:"success"
    })
}