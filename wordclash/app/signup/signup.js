'use strict';

angular.module('wordclashApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/signup/signup.html',
            controller: 'SignupCtrl'
        });
  });