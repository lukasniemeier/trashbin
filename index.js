var express = require('express');
var RingBuffer = require('./ring.js');
var bodyParser = require('body-parser');
var multer = require('multer'); 

var app = express();

console.log("1 " + process.env.CONFIG_BUFFER_SIZE);
console.log("2 " + (process.env.CONFIG_BUFFER_SIZE || 5));
console.log("3 " + ((process.env.CONFIG_BUFFER_SIZE || 5) || 50));
console.log("4 " + (((process.env.CONFIG_BUFFER_SIZE || 5) || 50)));
console.log("5 " + (typeof  (((process.env.CONFIG_BUFFER_SIZE || 5) || 50))));
console.log("6 " + (new Array(((process.env.CONFIG_BUFFER_SIZE || 5) || 50))).length);
console.log("7 " + parseInt(5));
var ring = new RingBuffer(process.env.CONFIG_BUFFER_SIZE || 5);

console.log("log buffer capacity is " + ring.capacity());

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.all('*', function(request, response) {
	var body = { 
		"time": new Date().toISOString(),
		"source": request.ip, 
		"method": request.method,
		"path": request.url, 
		"headers": request.headers, 
		"body": (request.body || "null")
	};
	ring.enq(body);
	response.status(200).json(ring.elements());
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});