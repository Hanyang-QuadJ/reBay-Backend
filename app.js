const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const mysql = require('mysql');
const config = require('./config');
// const conn = mysql.createConnection(config);

/* =======================
 LOAD THE CONFIG
 ==========================*/
const port = process.env.PORT || 3000;

/* =======================
 EXPRESS CONFIGURATION
 ==========================*/
const app = express();
// process.on('uncaughtException', function(err) {
// 	console.log('Caught exception: ' + err);
// });
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// parse JSON and url-encoded query
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
	res.send('alive');
});
// print the request log on console
app.use(morgan(':remote-addr'), function(req, res, next) {
	next();
});

app.use(morgan(':method'), function(req, res, next) {
	next();
});

app.use(morgan(':url'), function(req, res, next) {
	next();
});

app.use(morgan(':date'), function(req, res, next) {
	next();
});

app.use(morgan(':status'), function(req, res, next) {
	next();
});

var FCM = require('fcm-node');
var serverKey = 'AAAAyS0H1u0:APA91bFX9VjAXOe6hGbGu7CvRQg_qRZzFdOjwY_qper2qVxpiY6P-LEb5KLk_Rh96r0N9iD_NVm6yAwxzIqUZ702_wDQ2RZiNzBS9XdD3Ckf1L_bPxXHERiFmeT58g4REHGPZmT0If8G'; //put your server key here
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
	to: 'cZTG3Ch7RGQ:APA91bGhYr89_ywkzUB4da1uogHThZyr4eX1ut42RAIlPN6ik9OSSzc4xmJ9EayONQubCesxFaOlVpb0uuOL79YJ6Wu0UVhIOLUesivFUxeSxWxkDSqY3ivK3ULyomszyHzXmdGt8pkL',
	collapse_key: 'your_collapse_key',

	notification: {
		title: 'reBay',
		body: '신현종님의 Gucci가방이 성공적으로 판매완료 되었습니다.'
	},

	data: {  //you can send only notification or only data(or include both)
		my_key: 'my value',
		my_another_key: 'my another value'
	}
};

fcm.send(message, function (err, response) {
	if (err) {
		console.log("Something has gone wrong!");
	} else {
		console.log("Successfully sent with response: ", response);
	}
});
// set the secret key variable for jwt
app.set('jwt-secret', config.secret);
// index page, just for testing

app.use('/api', require('./routes/api'));

// open the server
app.listen(port, () => {
	console.log(`Express is running on port ${port}`)
});
