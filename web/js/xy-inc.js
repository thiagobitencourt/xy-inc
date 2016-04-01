var app = angular.module('xy-inc', ['ngRoute'])
.config(function($routeProvider) {
	$routeProvider
	.when('/inicio', {
	    controller: 'mainController',
	    templateUrl:'view/home.html'
	})
	.when('/teste', {
		controller: 'testController',
		templateUrl: 'view/test.html'
	})
	.when('/doc', {
		controller: 'docController',
    templateUrl: 'view/doc.html'
	})
	.when('/', {
		redirectTo: '/inicio'
	});
})
.factory("api", function($http){
	/** Service to interacts with the API */
	var _baseUrl = window.location.origin + '/api/poi';
	var _getPoi = function(params){
		var par = params || {};
		return $http.get(_baseUrl, par);
	};
	var _savePoi = function(poi){
			return $http.post(_baseUrl, poi);
	};
	var _updatePoi = function(poiId, poi) {
		return $http.put(_baseUrl + "/" + poiId, poi);
	};
  var _removePoi = function(poiId) {
		console.log("ID: " + poiId);
    return $http.delete(_baseUrl + "/" + poiId);
  };
	return {
		get: _getPoi,
		save: _savePoi,
		update: _updatePoi,
    remove: _removePoi
	};
})
