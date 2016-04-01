/**
	Author: Thiago R. M. Bitencourt
	Description: Handlers for HTTP Methods. Interface between controller and Express APIs.
*/
var express = require('express');
var validateId = require(__base + 'utils/validateObjectId');
var Controller = require(__base + 'controller/poiController');
var poiController = new Controller();
var router;
var LoadRoute = function(router){
	this.router = router;
	setRoutes();
	return;
}

var setRoutes = function(){
	//set variables that defines route path
	var poi = "/poi";
	var poiId = poi + "/:id";

	//Same simple code for all responses. Using factory to encapsulate the response (res) object.
	var responseHandlerFactory = function(res) {
		var _res = res;
		var _callback = function(err, result) {
			var code = err ? err.code : result.code;
			var message = err ? err.message : result.message;
			if (err)
				console.log(code + ": " + message);
			return _res.status(code).send(message);
		};
		return {
			callback: _callback,
			invalidId: () => res.status(400).send('Invalid ID')
		}
	};

	//GET Method
	this.router.get(poi, function(req, res){
		var handler = responseHandlerFactory(res);
		poiController.getAll(req.query, handler.callback);
	});
	//GET by ID Method
	this.router.get(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.getOne(req.params.id, handler.callback);
	});
	//POST method
	this.router.post(poi, function(req, res){
		var handler = responseHandlerFactory(res);
		poiController.save(req.body, handler.callback);
	});
	//PUT method
	this.router.put(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.update(req.params.id, req.body, handler.callback);
	});
	//DELETE method
	this.router.delete(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.remove(req.params.id, handler.callback);
	});
}

module.exports = LoadRoute;
