app.controller('docController', function($scope, $rootScope, $location, $anchorScroll) {
  $rootScope.$emit('changePath', $location.path());
  $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   }
});
