/**
	Author: Thiago R. M. Bitencourt
	Description: An MongoDB ID follows a pattern, this class is used to validate a value to tell if it's a valid MongoDB ID or is not.
*/
var mongoose = require('mongoose');
var validateId = function(){
	var _isIdValid = function(id){
		try{
			//Create and object ID based on the incoming id value.
			var objId = new mongoose.Types.ObjectId(id);
			// The object ID must be the same of the incoming id value.
			if(objId != id){
				return false;
			}else{
				return true;
			}
		}catch(err){
			//Error on create bject ID.
			return false;
		}
	}
	return {
		isIdValid: _isIdValid
	}
}();

module.exports = validateId;
