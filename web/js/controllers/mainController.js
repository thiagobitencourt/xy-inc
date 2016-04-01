app.controller('mainController', function($scope, $rootScope, $location) {
  //Event listener to set active links on menu.
  $rootScope.$on('changePath', function(ev, data) {
    switch (data) {
      case '/teste':
        $scope.pathTest = true;
        $scope.pathDocs = false;
        $scope.pathInicio = false;
        break;
      case '/doc':
        $scope.pathTest = false;
        $scope.pathDocs = true;
        $scope.pathInicio = false;
        break;
      default:
        $scope.pathTest = false;
        $scope.pathDocs = false;
        $scope.pathInicio = true;
    }
  });
  $rootScope.$emit('changePath', $location.path());
});
