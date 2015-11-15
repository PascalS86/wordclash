'use strict';

angular.module('wordclashApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'app/game/game.html',
            controller: 'GameCtrl'
        });
  });