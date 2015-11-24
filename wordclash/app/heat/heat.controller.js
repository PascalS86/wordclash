'use strict';

angular.module('wordclashApp').controller('HeatCtrl', ['$http', 'Hub','$timeout', '$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', 'colorService', function ($http, Hub, $timeout, $scope, $rootScope, $location, authService, ngAuthSettings, colorService) {

    $scope.authentication = authService.authentication;
    $scope.game = $rootScope.currentGame;
    $scope.startText = $scope.game.GameText;
    $scope.players = $scope.game.Players;
    //Setup Hub
    var hub = new Hub('gameHub', {

        //client side methods
        listeners: {
            'broadcastMessage': function (eventName, game) {
                if (eventName == "game") {
                    if (game.userName == $scope.authentication.userName && game.gameId == $rootScope.currentGame.GameId) {
                        safeApply($scope, $rootScope, function () {
                            $rootScope.currentGame.timeLeft = game.timeLeft;
                            $rootScope.currentGame.currentRound = game.round;
                            $location.path('game');
                        });
                    }

                }
            }
        },

        //server side methods
        methods: ['sendStart'],

        //query params sent on initial connection
        queryParams: {
        },

        //handle connection error
        errorHandler: function (error) {
            console.error(error);
        },

        //specify a non default root
        //rootPath: '/api

        stateChanged: function (state) {
            switch (state.newState) {
                case $.signalR.connectionState.connecting:
                    //your code here
                    break;
                case $.signalR.connectionState.connected:
                    //your code here
                    break;
                case $.signalR.connectionState.reconnecting:
                    //your code here
                    break;
                case $.signalR.connectionState.disconnected:
                    //your code here
                    break;
            }
        }
    });

    //hub.disconnect();
    //hub.connected();
    /** 
      * Colorize function 
      */ 
    $scope.getColor = colorService.gamerColor;

    var countDownStart = 3; 
 
    var callCountdown = function () { 
    safeApply($scope, $rootScope, countdown); 
    }; 

    var countdown = function () { 
    if (countDownStart === 0) { 
    $scope.heatup = 'Go!'; 
    hub.sendStart($scope.game.GameId, $scope.authentication.userName);
    } 
    else { 
    $scope.heatup = countDownStart.toString() + '...'; 
    $timeout(callCountdown, 1000); 
    } 
    countDownStart--; 
    }; 
    /** 
    * 
    * @param scope 
    * @param fn 
    */ 

    function safeApply(scope, root, fn) {
        (scope.$$phase || (root.$$phase)) ? fn() : scope.$apply(fn);
    }

 
     // Start with countdown immidiately 
  	callCountdown(); 


}]);
