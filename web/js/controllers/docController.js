app.controller('docController', function($scope, $rootScope, $location) {
  $rootScope.$emit('changePath', $location.path());
});
