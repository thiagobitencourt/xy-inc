/**
  Author: Thiago R. M. Bitencourt
  Description: Load all Route Classes, using the global express.Router instance.
*/
var express = require('express');
var PoiRoute = require(__base + 'routes/poiRoute');
var LoadRoutes = function(){
	router = express.Router();
  new PoiRoute(router);
	return router;
}

module.exports = LoadRoutes;
