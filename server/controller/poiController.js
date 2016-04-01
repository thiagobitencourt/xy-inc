/**
  Author: Thiago R. M. Bitencourt
  Description:
    Controller responsável pela interação com o modelo POI.
    Toda implementação de regra de negócio que envolva a entidade POI deve ser implementada nesta classe.
*/
'use strict';
var PoiModel = require(__base + 'models/poi');
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
    var query = params.q || {};
    var cb = function(err, result) {
      if (err) return callback({code: 500, message: 'Internal Error: ' + err.toString()});

      callback(null, {code: 200, message: result});
    };
    //If there are one parameter (x or y) the other must also be informed. Invalid, otherwise.
    if (params.x || params.y) {
      if (!params.x || !params.y) {
        var missingP = params.x ? 'y' : 'x';
        return callback({code: 400, message: "Missing parameter " + missingP});
      }
      var dmax = params.dmax ? params.dmax : 10; //Default max distanve.
      var obj = {x: params.x, y: params.y, dmax: dmax, query: query || null};
      return PoiModel.getPois(obj, cb);
    }
    //If there are no x and y parameters procede with the default quering
    PoiModel.find()
    .where(query)
    .select({__v: 0})
    .exec(cb);
  };

  /**
    Return: Only one POI object or empty if nothing found.
    Example: {_id: '', nome: 'Pub', x: 12, y: 8}
    Response Codes:
      200 (Success) for success;
      404 (Not Found) for unexistent ID;
      500 (Internal Server Error) for internal errors;
  */
  this.getOne = function(id, callback) {
    PoiModel.findOne({_id: id})
    .select({__v: 0})
    .exec(function(err, result){
        if (err) return callback({code: 500, message: 'Internal Error: ' + err.toString()});
        if (!result)
          return callback({code: 404, message: 'ID Not Found'});
        callback(null, {code: 200, message: result});
    });
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
  this.save = function(poi, callback) {
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
        return callback(errMsg);
      }
      callback(null, {code: 200, message: 'Object successfully created'});
    });
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
  this.update = function(id, poi, callback) {
    PoiModel.secureUpdate(id, poi, function(err) {
      if (err) return callback(err);
      callback(null, {code: 200, message: "Object successfully updated"});
    });
  };

  /**
    Param: The database id of the object to be removed.
    Return: Success message or Error message.
    Response Codes:
      200 (Success) for success;
      404 (Bad Request) for unexisting ID;
      500 (Internal Server Error) for internal errors;
  */
  this.remove = function(id, callback) {
    PoiModel.findOne()
    .where({_id: id})
    .exec(function(err, result){
        if (err) return callback({code: 500, message: 'Internal Error: ' + err.toString()});
        if (!result)
          return callback({code: 404, message: 'ID Not Found'});
        result.remove(function(err, r) {
          if (err) return callback({code: 500, message: 'Internal Error on Remove: ' + err.toString()});
          callback(null, {code: 200, message: "Object successfully removed"});
        });
    });
  };
};

module.exports = poiController;
