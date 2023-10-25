var app = require('express')();
const express = require("express")
const bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var https = require('https');
const { v4: uuidv4 } = require('uuid');
var moment=require('moment');

var privateKey  = fs.readFileSync('./cert/Your.key', 'utf8');
var certificate = fs.readFileSync('./cert/Your.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 80
var SSLPORT = 1943

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
httpsServer.on('listening', onListening);
function onListening() {
  var addr = httpsServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

//Something about users.
var user = "0C56536A-8F77-03CB-0815-849400714EE4";
var device = "00000000-0000-0000-0000-000000000000";

var taskDone_GetPic = false;

var taskJSON = { 
    devices:[
          {
              deviceID:"",
              users:[
                     {
                         userID:"",
                         tasks:[
						    {
						       id:"",
							   type:"",
							   params:"",
							   start:0,
							   end:0,
							   state:-1  //-1 Do not enable 0 Wait 1 Doing 2 Done
						    }
						 ]
                     }
              ]
          }
     ]
}

function ifDeviceExist(queryDevID){
	//taskJSON.devices
	for(var _i in taskJSON.devices){
		if(taskJSON.devices[_i].deviceID == queryDevID){
			return _i;
		}
	}
    return -1;
}
function ifUserExist(devIDindex,queryUserID){
	//taskJSON.devices
	for(var _i in taskJSON.devices[devIDindex].users){
		if(taskJSON.devices[devIDindex].users[_i].userID == queryUserID){
			return _i;
		}
	}
    return -1;
}
function ifTaskExist(devIDindex,UserIDindex,queryTask){
	//taskJSON.devices
	for(var _i in taskJSON.devices[devIDindex].users[UserIDindex].tasks){
		if(taskJSON.devices[devIDindex].users[UserIDindex].tasks[_i].id == queryTask){
			return _i;
		}
	}
    return -1;
}


// Welcome
app.use('', express.static('./'));

//.well-known/pki-validation/
app.get('/.well-known/pki-validation/65F7001A848BA890A2546BA967D13C0C.txt', function(req, res) {
//'\r\n'
    res.writeHead(200,{"Content-Type":"text/plain;charset=utf-8"});
    res.end('FA914DCF0C38BE0DE06A3BD00C97299D2825329E9C9C7928F0F6A4342B45DC4B\r\ntrust-provider.com\r\nTTD02Jiqsa\r\n');
});
app.get('/getCurrentLogin', function(req, res) {
	var newStr = JSON.stringify(taskJSON);
	res.status(200).send(newStr);
});
//json
app.get('/getTask', function(req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('You shall use POST method.');
    }
    else {
        res.status(200).send('You shall use POST method and HTTPS!');
    }
    res.end();
});
app.post('/getTask', (req, res) => {
    //接受post请求参数  使用req.body
    //res.send(req.body)
    var newStr = JSON.stringify(req.body);
    newStr = newStr.replace(/[\\']/g, "\"");
    //console.log(newStr);

    if(req.body != "undefined"){
		var jsonParsed = JSON.parse(newStr);
    }else{
		return;
    }
    device = jsonParsed.device;
    user = jsonParsed.user;
	
	var deviceID = ifDeviceExist(device);
	if(deviceID == -1){
		console.log("New Device "+device+" logged in.");
		taskJSON.devices.push({deviceID:device,users:[]});
	}
	deviceID = ifDeviceExist(device);
	var userID = ifUserExist(deviceID,user);
	if(userID == -1){
		console.log("New User "+user+" From "+device+" logged in.");
		taskJSON.devices[deviceID].users.push({userID:user,tasks:[]});
	}
	userID = ifUserExist(deviceID,user);
	
	
    var _data = taskJSON.devices[deviceID].users[userID];
	
    var content = JSON.stringify(_data); 
    res.send(content);
    res.end();
});

//json
app.get('/report', function(req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('You shall use POST method.');
    }
    else {
        res.status(200).send('You shall use POST method and HTTPS!');
    }
    res.end();
});
app.post('/report', (req, res) => {
    //接受post请求参数  使用req.body
    //res.send(req.body)
    var newStr = JSON.stringify(req.body);
    newStr = newStr.replace(/[\\']/g, "\"");
    console.log(newStr);
	
	var device_req = req.body.device;
	var deviceID = ifDeviceExist(device_req);
	if(deviceID == -1){
		console.log("New Device "+device_req+" logged in.");
		taskJSON.devices.push({deviceID:device_req,users:[]});
	}
	deviceID = ifDeviceExist(device_req);
	
	var user_req = req.body.user;
	var userID = ifUserExist(deviceID,user_req);
	if(userID == -1){
		console.log("New User "+user_req+" From "+device+" logged in.");
		taskJSON.devices[deviceID].users.push({userID:user_req,tasks:[]});
	}
	userID = ifUserExist(deviceID,user_req);
	
	var task_req = req.body.task;
	var taskID = ifTaskExist(deviceID,userID,task_req);
	if(taskID == -1){
		res.status(205).send('Received a possibly formly created task.But server did not save data.');
		console.log("Error at user "+req.body.user+" From device "+req.body.device +" :Non exist Task");
		return;
	}
	taskID = ifTaskExist(deviceID,userID,task_req);
	taskJSON.devices[deviceID].users[userID].tasks[taskID].end = moment(Date.now()).format('YYYY-MM-DD HH:MM');
	taskJSON.devices[deviceID].users[userID].tasks[taskID].state = 2;
	
	console.log(taskJSON.devices[deviceID].users[userID].tasks[taskID]);
    res.status(200).send('OK');
    res.end();
});

app.get('/com', function(req, res) {
	var device_req = req.query.dev;
	var deviceID = ifDeviceExist(device_req);
	if(deviceID == -1){
		console.log("New Device "+device_req+" logged in.");
		taskJSON.devices.push({deviceID:device_req,users:[]});
	}
	deviceID = ifDeviceExist(device_req);
	
	var user_req = req.query.usr;
	var userID = ifUserExist(deviceID,user_req);
	if(userID == -1){
		console.log("New User "+user_req+" From "+device+" logged in.");
		taskJSON.devices[deviceID].users.push({userID:user_req,tasks:[]});
	}
	userID = ifUserExist(deviceID,user_req);
	
	var _data = {
		id:uuidv4(),
		type:req.query.mth,
		params:"",
		start:moment(Date.now()).format('YYYY-MM-DD HH:MM'),
		end:0,
		state:1  //-1 Do not enable 0 Wait 1 Doing 2 Done
	};
	
	taskJSON.devices[deviceID].users[userID].tasks.push(_data);
	res.status(200).send('OK');
});