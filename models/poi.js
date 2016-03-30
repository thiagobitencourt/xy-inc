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
  name: {type: String, required: true},
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

/**
  Use the traditional approach of first retrieving the document, update values and than save.
  Safer than Model.update for mongoose.
*/
schema.statics.secureUpdate = function(id, newPoi) {
  var deferred = q.defer();
  this.findOne()
  .where({_id: id})
  .exec(function(err, poi) {
    if (err) return deferred.reject({code: 500, message: 'Internal Error: ' + err.toString()});
    // No poi found, return POI Don't Exist message and Bad Request code.
    if (!poi) return deferred.reject({code: 400, message: 'ID Not Found'});
    //update all attributes based on the new object.
    for(var attr in newPoi) {
      poi[attr] = newPoi[attr];
    }
    //save the updated object
    poi.save(function(err) {
      if (err) return deferred.reject({code: 500, message: 'Internal Error: ' + err.toString()});
      deferred.resolve();
    });
  });
  return deferred.promise;
}

module.exports = mongoose.model('POI', schema);
