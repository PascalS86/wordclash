'use strict';

angular.module('wordclashApp').controller('GameCtrl', 
    ['$http', 'Hub', '$timeout', '$scope', '$rootScope', '$location', 'authService', 'ngAuthSettings', 'colorService', 'modalService','usSpinnerService',
    function ($http, Hub, $timeout, $scope, $rootScope, $location, authService, ngAuthSettings, colorService, modalService,usSpinnerService) {

    $scope.authentication = authService.authentication;
    $scope.game = $rootScope.currentGame;
    $scope.message = "";
    $scope.startText = $scope.game.GameText;
    $scope.players = $scope.game.Players;
    $scope.storyParts = new Array();
    $scope.isTextInputEnabled = ($scope.game.StoryParts[$scope.game.currentRound].CurrentUser === $scope.authentication.userName);
    $scope.showTyping =false;
    $scope.isBusy = false;
    $scope.getColor = colorService.gamerColor;

    $scope.timeLeft = $scope.game.timeLeft / 1000;

    var typed = false;
    //Definition of Hub
    var hub = new Hub('gameHub', {

        //client side methods
        listeners: {
            'broadcastStoryMessage': function (message, gameId, userName, round, score) {
                if (gameId == $scope.currentGame.GameId) {
                    safeApply($scope, $rootScope, function () {
                        $scope.message = "";
                        $scope.storyParts.push({ message: message, userName: userName, points:score });
                        $scope.game.currentRound = round;
                        var isTextInputEnabled = ($scope.game.StoryParts[$scope.game.currentRound].CurrentUser === $scope.authentication.userName);
                        if (isTextInputEnabled && isTextInputEnabled != $scope.isTextInputEnabled) {
                            $scope.isTextInputEnabled = isTextInputEnabled;
                            callCountdown();
                        }
                        else
                            $scope.isTextInputEnabled = isTextInputEnabled;

                        typed = false;
                    });
                }
            }
            , 'broadcastEndMessage': function (gameId, playerOneStats, playerTwoStats) {
                if (gameId == $scope.currentGame.GameId) {
                    safeApply($scope, $rootScope, function () {
                        usSpinnerService.stop('spinner-1');
                        $scope.isBusy = false;
                        var resultMessage = "";
                        var playerOneWins = playerOneStats.points > playerTwoStats.points;
                        var playerTwoWins = playerOneStats.points < playerTwoStats.points;
                        if (playerOneStats.userName == $scope.authentication.userName) {
                            if (playerOneWins) {
                                resultMessage = "<h2>Du hast gewonnen!</h2>";
                            }
                            else if (playerTwoWins) {
                                resultMessage = "<h2>Du hast verloren!</h2>";
                            }
                            else {
                                resultMessage = "<h2>Unentschieden</h2>";
                            }
                            resultMessage += "<br /> Du hast " + playerOneStats.points + " Punkte!";
                        }
                        else {
                            if (playerOneWins) {
                                resultMessage = "<h2>Du hast verloren!</h2>";
                            }
                            else if (playerTwoWins) {
                                resultMessage = "<h2>Du hast gewonnen!</h2>";
                            }
                            else {
                                resultMessage = "<h2>Unentschieden</h2>";
                            }
                            resultMessage += "<br /> Du hast " + playerTwoStats.points + " Punkte!";
                        }
                        modalService.showDialog("Clash-Ergebnis", resultMessage)
                            .then(function () {
                                $location.path('score');
                            });
                    });
                }
            }
           
            , 'broadcastInput': function (gameId, userName) {
                if (gameId == $scope.currentGame.GameId) {
                    safeApply($scope, $rootScope, function () {
                        if (!$scope.isTextInputEnabled) {
                            $scope.showTyping = true;
                            typed = true;
                            callTyped();
                        }
                        else {
                            $scope.showTyping = false;
                        }
                    });
                }
            }
            , 'broadcastWaitForScore': function (gameId) {
                if (gameId == $scope.currentGame.GameId) {
                    safeApply($scope, $rootScope, function () {
                        $scope.isBusy = true;
                        $scope.isTextInputEnabled = false;
                        usSpinnerService.spin('spinner-1');
                    });
                }
            }
        },

        //server side methods
        methods: ['sendStoryMessage', 'sendInput'],

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

    var callCountdown = function () {
        safeApply($scope, $rootScope, countdown);
    };

    var countdown = function () {
        if (!$scope.isTextInputEnabled) {
            return;
        }
        else if ($scope.timeLeft == 0) {
            $scope.sendMessage("");
        }
        else {
            $scope.timeLeft--;
            $timeout(callCountdown, 1000);
        }
    };

    var callTyped = function () {
        safeApply($scope, $rootScope, updateTyped);
    };

    var updateTyped = function () {
        if ($scope.showTyping && typed) {
            typed = false;
            $timeout(callTyped, 2000);
        }
        else {
            $scope.showTyping = false;
            return;
        }
    };

    $scope.sendMessage = function (message) {
        hub.sendStoryMessage(message, $scope.game.GameId, $scope.authentication.userName, $scope.game.currentRound, $scope.timeLeft);
    };

    $scope.sendInput = function () {
        hub.sendInput($scope.game.GameId, $scope.authentication.userName);
    }

    function safeApply(scope, root, fn) {
        (scope.$$phase || (root.$$phase)) ? fn() : scope.$apply(fn);
    }

    if ($scope.isTextInputEnabled) {
        callCountdown();
    }

}]);
