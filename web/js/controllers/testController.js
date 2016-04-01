app.controller('testController', function($scope, $rootScope, $location, api) {
  $rootScope.$emit('changePath', $location.path());

  var updating = false;
  /** Loar all Poins from the data base and set on scope to show in UI. */
  loadAllPois = function() {
    api.get().then(function(data) {
      $scope.pois = data.data;
    }, function(err) {
      $scope.apiError = err.data;
    });
  };
  /** Save a new point.
    Same function to save a new Point and to update an existing one.
    The updating flag indicates the operation type (Post or Put).
   */
  $scope.savePoi = function() {
    if (!updating) {
      api.save($scope.poi).then(function(data) {
        delete $scope.poi;
        loadAllPois();
      },
      function(err) {
        $scope.apiError = err.data;
      });
    } else {
      updating = false;
      api.update($scope.poi._id, $scope.poi).then(function(data){
        delete $scope.poi;
        loadAllPois();
      },
      function(err) {
        $scope.apiError = err.data;
      });
    }
  }
  /** Update the selected Point */
  $scope.updatePoi = function(p) {
    $scope.poi = p;
    updating = true;
  }
  /** Remove and existing Point */
  $scope.removePoi = function(poi) {
    api.remove(poi._id).then(function(data) {
      loadAllPois();
    },
    function(err){
      $scope.apiError = err.data;
    });
  }
  /** Close the Error message in the view */
  $scope.closeErr = function() {
    delete $scope.apiError;
  }
  /** Search for the points near the given reference point */
  $scope.search = function() {
    api.get({params: $scope.p}).then(function(data) {
      delete $scope.p;
      $scope.foundPois = data.data;
    },
    function(err) {
      $scope.apiError = err.data;
    });
  }
  /** Clear the temporary variables */
  $scope.clear = function() {
    delete $scope.apiError;
    delete $scope.foundPois;
    delete $scope.poi;
    delete $scope.p;
  }
  /** Call the loadAllPois to set data on scope. */
  loadAllPois();
});
