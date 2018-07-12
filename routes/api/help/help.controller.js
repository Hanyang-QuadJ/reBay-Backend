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
    const {ask, seller_id, item_id} = req.body;
    try {
        item = await query.getItemById(item_id);
        buyer = await query.getUserByUserId(req.decoded._id);
        seller = await query.getUserByUserId(seller_id);
        result = await query.createHelp(req.decoded._id, ask, seller_id, item_id);
        message = buyer.username + " 님이 판매물건 " + item.item_name + " 에 대해 문의했습니다.";
        sendMessageResult = await query.sendMessage(seller.fcm_token, message);
        return res.status(200).json({
            message: "success"
        });
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.getHelps = async (req, res) => {
    try {
        helps = await query.getHelpsByUserId(req.decoded._id)
        for (help of helps) {
            item = await query.getItemById(help.item_id);
            help.item = item;
            image = await query.getImageByItemId(help.item_id);
            help.image = image;
        }
        return res.status(200).json(helps);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.getHelpById = async (req, res) => {
    const {id} = req.params;
    try {
        help = await query.getHelpById(id)
        return res.status(200).json({help})
    }
    catch (err) {
        return res.status(400).json(err)
    }
}

exports.deleteHelp = async (req, res) => {
    const {id} = req.params;
    try {
        result = await query.deleteHelpById(id);
        return res.status(200).json({
            message: "success"
        })
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.getHelpsBySellerId = async (req, res) => {
    const {id} = req.params;
    try {
        helps = await query.getHelpsBySellerId(id);
        for (help of helps) {
            item = await query.getItemById(help.item_id);
            help.item = item;
            image = await query.getImageByItemId(help.item_id);
            help.image = image;
        }
        return res.status(200).json(helps);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.getHelpsByItemId = async (req, res) => {
    const {item_id} = req.params;
    try {
        const helps = await query.getHelpsByItemId(item_id);
        for (help of helps) {
            help.user = await query.getUserByUserId(help.user_id);
            help.seller = await query.getUserByUserId(help.seller_id);
        }
        return res.status(200).json(helps);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.getHelpsByItemIdOfMe = async (req, res) => {
    const {item_id} = req.params;
    try {
        const helps = await query.getHelpsByItemId(item_id);
        for (help of helps) {
            help.user = await query.getUserByUserId(help.user_id);
            help.seller = await query.getUserByUserId(help.seller_id);
        }
        const myHelps = [];
        for (help of helps) {
            if (help.user_id === req.decoded._id) {
                myHelps.push(help);
            }
        }
        return res.status(200).json(myHelps);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

exports.patchAnswerToHelpByHelpId = async (req, res) => {
    const {help_id, answer} = req.body;
    try {
        help = await query.getHelpById(help_id);
        await query.patchHelps(help_id, help.ask, answer);
        return res.status(200).json({message: "success"});
    }
    catch (err) {
        return res.status(400).json(err);
    }
}