/**
  Author: Thiago Bitencourt
  Description: Model definition using mongoose.
*/
'use strict'
var mongoose = require('mongoose');
var q = require('q');
//Validate value x and y before insert, value can't be negative.
var validate = v => v >= 0;
var msg = '{VALUE} must be greater than or equal to 0 (zero)';
//Define schema
var Schema = mongoose.Schema;
var schema = new Schema({
  nome: {type: String, required: true},
  x: {type: Number, required: true, validate: {
    validator: validate,
    message: msg
  }},
  y: {type: Number, required: true, validate: {
    validator: validate,
    message: msg
  }},
});

schema.index({ x: 1, y: 1}, { unique: true });

schema.statics.getPois = function(obj, callback) {
  if (!obj.x || !obj.y || !obj.dmax)
    callback("Missing parameters.");
  /**
    I've tried to use this:
      { $near: [ obj.x , obj.y ],  '$maxDistance': obj.dmax }
    But, was not able to because (Damn error): "Error: Can't use $maxDistance with Number."
  */
  this.find()
  .where(obj.query)
  .exec(function(err, result) {
    if (err) return callback(err);
    var response = result.filter(el => {
      var nX = Math.abs(obj.x - el.x);
      var nY = Math.abs(obj.y - el.y);
      return (nX + nY) <= obj.dmax;
    }).map(e => e.nome); //Returns only the name of each point
    callback(null, response);
  });
};

/**
  Use the traditional approach of first retrieving the document, update values and than save.
  Safer than Model.update for mongoose.
*/
schema.statics.secureUpdate = function(id, newPoi, callback) {
  this.findOne()
  .where({_id: id})
  .exec(function(err, poi) {
    if (err) return callback({code: 500, message: 'Internal Error: ' + err.toString()});
    // No poi found, return POI Don't Exist message and Bad Request code.
    if (!poi) return callback({code: 400, message: 'ID Not Found'});
    //update all attributes based on the new object.
    for(var attr in newPoi) {
      poi[attr] = newPoi[attr];
    }
    //save the updated object
    poi.save(function(err) {
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
      callback(null);
    });
  });
}

module.exports = mongoose.model('POI', schema);
