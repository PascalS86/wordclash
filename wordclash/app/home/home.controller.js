'use strict';
angular.module('wordclashApp').controller('HomeCtrl', ['$http', '$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', 'Hub', function ($http, $scope, $rootScope, $location, authService, ngAuthSettings, Hub) {

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }
    $scope.clicked = false;
    $scope.authentication = authService.authentication;
    $scope.isLoggedIn = function () { return $scope.authentication.isAuth; };
    $scope.join = function (mode) {
        $scope.clicked = true;
        $http.get(ngAuthSettings.apiServiceBaseUri + 'api/game/join/' + $scope.authentication.userName).then(function (response) {
            $scope.clicked = false;
            if (response.data != "undefined" && response.data != null && response.data != "")
                $location.path(response.data);
        },
        function (err) {
            $scope.clicked = false;
            $scope.message = err.error_description;
        });
    };
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
    hub.disconnect();
    hub.connect();
    if ($scope.isLoggedIn()) {
        $http.get(ngAuthSettings.apiServiceBaseUri + 'api/game/clear/' + $scope.authentication.userName).then(function (response) {
            if (response.data != "undefined" && response.data != null && response.data != "")
                $location.path(response.data);
        },
            function (err) {
                $scope.message = err.error_description;
            });
    }
    function safeApply(scope, root, fn) {
        (scope.$$phase || (root.$$phase)) ? fn() : scope.$apply(fn);
    }
}]);