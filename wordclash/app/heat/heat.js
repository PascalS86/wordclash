'use strict';

angular.module('wordclashApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('heat', {
            url: '/heat',
            templateUrl: 'app/heat/heat.html',
            controller: 'HeatCtrl'
        });
  });