/**
	Author: Thiago R. M. Bitencourt
	Description:
		Platform to offer a service that helps people to get location of a point of interests (POIs - Pontos de Interesse).
		The service receives a coordinate X and Y that specifies  a reference point, as well as a max distance (d-max) in meters.
		Returns all the POIs from the data base that are in a distance minor or equal of d-max from the reference point.
*/
'use strict';
global.__base = __dirname + '/';
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var Cors = require('cors');
var LoadRouter = require(__base + 'routes/loadRoutes');
var uri = 'mongodb://localhost/xy-inc';
mongoose.connect(uri, null, function(err){
	if(err)
		return console.error("DB error : " + err);

  var app = express();
  app.use(Cors());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: 'application/json'}));
  //Necessary headers to clients access.
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

	app.use('/', express.static(__dirname + '/web'));
	//Load all Available routes, under /api path
  app.use('/api', new LoadRouter());
	//Start server
  var httpPort = process.env.port || 8000;
  http.createServer(app).listen(httpPort, function(){
    console.log("HTTP server listening on port %s", httpPort);
  });
});
