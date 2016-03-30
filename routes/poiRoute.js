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
		return {
			success: r => res.status(r.code).send(r.message),
			error: err => res.status(err.code).send(err.message),
			invalidId: () => res.status(400).send('Invalid ID')
		}
	};

	//GET Method
	this.router.get(poi, function(req, res){
		var handler = responseHandlerFactory(res);
		poiController.getAll(req.params)
		.then(handler.success) //Success
		.catch(handler.error); //Error
	});
	//GET by ID Method
	this.router.get(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.getOne(req.params.id)
		.then(handler.success) //Success
		.catch(handler.error); //Error
	});
	//POST method
	this.router.post(poi, function(req, res){
		var handler = responseHandlerFactory(res);
		poiController.save(req.body)
		.then(handler.success) //Success
		.catch(handler.error); //Error
	});
	//PUT method
	this.router.put(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.update(req.params.id, req.body)
		.then(handler.success) //Success
		.catch(handler.error); //Error
	});
	//DELETE method
	this.router.delete(poiId, function(req, res){
		var handler = responseHandlerFactory(res);
		//The incoming ID must be valid.
		if (!validateId.isIdValid(req.params.id))
			return handler.invalidId();

		poiController.remove(req.param.id)
		.then(handler.success) //Success
		.catch(handler.error); //Error
	});
}

module.exports = LoadRoute;
