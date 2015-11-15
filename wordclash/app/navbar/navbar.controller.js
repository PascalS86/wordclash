'use strict';

angular.module('wordclashApp')
  .controller('NavbarCtrl', function ($scope, $location, authService) {
      $scope.menu = [{
          'title': 'Wordclash',
          'link': '/'
      }];

      $scope.isCollapsed = true;
      $scope.isLoggedIn = function() { return authService.authentication.isAuth;};
      $scope.getCurrentUser = authService.authentication.userName;

      $scope.logout = function () {
          authService.logOut();
          $location.path('/login');
      };

      $scope.isActive = function (route) {
          return route === $location.path();
      };
  });