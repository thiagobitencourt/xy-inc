/**
  Author: Thiago R. M. Bitencourt
  Description:
    Controller responsável pela interação com o modelo POI.
    Toda implementação de regra de negócio que envolva a entidade POI deve ser implementada nesta classe.
*/
'use strict';
var PoiModel = require(__base + 'models/poi');
var q = require('q');

/**
  All the return objects follow this pattern:
  {
    code: 200,
    message: 'Any message here'
  }
  This is used by poiRoute class to define the API/HTTP response.
*/
var poiController = function() {
  /**
    Return: Array with all POIs, empty array if nothing found.
    Example: [{nome: 'Posto', x: 31, y: 18}]
    Empty Example: []
    Response Codes:
      200 (Success) for success;
      400 (Bad Request) for any invalid query;
      500 (Internal Server Error) for internal errors;
  */
  this.getAll = function(params, callback) {
    var deferred = q.defer();
    // if (!params.x || !params.y || !params.d-max)
    //   return deferred.reject({code: 400, message: 'Parameters missing'});
    //TODO: parei aqui.
    var query = {};
    PoiModel.find()
    .where(query)
    .select({__v: 0})
    .exec(function(err, result){
        if (err) return deferred.reject({code: 500, message: 'Internal Error: ' + err.toString()});
        deferred.resolve({code: 200, message: result});
    });
    return deferred.promise;
  };

  /**
    Return: Only one POI object or empty if nothing found.
    Example: {_id: '', nome: 'Pub', x: 12, y: 8}
    Response Codes:
      200 (Success) for success;
      404 (Not Found) for unexistent ID;
      500 (Internal Server Error) for internal errors;
  */
  this.getOne = function(id) {
    var deferred = q.defer();
    PoiModel.findOne({_id: id})
    .select({__v: 0})
    .exec(function(err, result){
        if (err) return deferred.reject({code: 500, message: 'Internal Error: ' + err.toString()});
        if (!result)
          return deferred.reject({code: 404, message: 'ID Not Found'});
        deferred.resolve({code: 200, message: result});
    });
    return deferred.promise;
  };

  /**
    Param: poi - Object to be saved into database.
    Return: Success message or Error message.
      Incomming Object Example: {nome: 'Pub', x: 12, y: 8}
    Response Codes:
      200 (Success) for success;
      400 (Bad Request) for any object violation;
      500 (Internal Server Error) for internal errors;
  */
  this.save = function(poi) {
    var deferred = q.defer();
    var newPoi = new PoiModel(poi);
    newPoi.save(function(err, p) {
      if (err) {
        var errMsg = {};
          if (err.errors && err.errors.name && err.errors.name.kind === 'required')
            errMsg = {code: 400, message: err.errors.name.message};
          else if (err.code === 11000)
            errMsg = {code: 400, message: 'Coordinates already into database'};
          else
            errMsg = {code: 400, message: 'Error: ' + err.toString()};
        return deferred.reject(errMsg);
      }
      deferred.resolve({code: 200, message: 'Object successfully created'});
    });
    return deferred.promise;
  };

  /**
    Param: poi - Object to be updated on database.
      Incomming Object Example: {_id: '', nome: 'Pub', x: 12, y: 8}
    Return: Success message or Error message.
    Response Codes:
      200 (Success) for success;
      404 (Bad Request) for unexistent ID;
      500 (Internal Server Error) for internal errors;
  */
  this.update = function(id, poi) {
    var deferred = q.defer();
    PoiModel.secureUpdate(id, poi)
    .then(function() {
      deferred.resolve({code: 200, message: "Object successfully updated"});
    });
    return deferred.promise;
  };

  /**
    Param: The database id of the object to be removed.
    Return: Success message or Error message.
    Response Codes:
      200 (Success) for success;
      404 (Bad Request) for unexisting ID;
      500 (Internal Server Error) for internal errors;
  */
  this.remove = function(id) {
    var deferred = q.defer();
    PoiModel.findOne()
    .where({_id: id})
    .exec(function(err, result){
        if (err) return deferred.reject({code: 500, message: 'Internal Error: ' + err.toString()});
        if (!result)
          return deferred.reject({code: 404, message: 'ID Not Found'});
        result.remove(function(err, r) {
          if (err) return deferred.reject({code: 500, message: 'Internal Error on Remove: ' + err.toString()});
          deferred.resolve({code: 200, message: "Object successfully removed"});
        });
    });
    return deferred.promise;
  };
};

module.exports = poiController;
