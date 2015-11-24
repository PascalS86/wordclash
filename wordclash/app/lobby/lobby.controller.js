'use strict';

angular.module('wordclashApp').controller('LobbyCtrl', ['$http', 'Hub', '$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', function ($http, Hub, $scope, $rootScope, $location, authService, ngAuthSettings) {

    $scope.authentication = authService.authentication;
    //Setup Hub
    var hub = new Hub('gameHub', {

        //client side methods
        listeners: {
            'broadcastMessage': function (eventName, game) {
                if (eventName == 'heat') {
                    safeApply($scope, $rootScope, function () {
                        if (game.Players[0].UserName == $scope.authentication.userName || game.Players[1].UserName == $scope.authentication.userName){
                            $rootScope.currentGame = game;
                            $location.path('heat');
                        }
                    });
                }               
            }
        },


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
    function safeApply(scope, root, fn) {
        (scope.$$phase || (root.$$phase)) ? fn() : scope.$apply(fn);
    }    

}]);
