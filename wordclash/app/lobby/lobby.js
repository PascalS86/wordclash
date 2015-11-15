'use strict';

angular.module('wordclashApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'app/lobby/lobby.html',
            controller: 'LobbyCtrl'
        });
  });