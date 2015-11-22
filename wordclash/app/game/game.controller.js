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
        $scope.wordChosen = false;
        $scope.timeLeft = $scope.game.timeLeft / 1000;

        readTags();
       

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
                            $scope.wordChosen = false;
                            if (isTextInputEnabled && isTextInputEnabled != $scope.isTextInputEnabled) {
                                $scope.isTextInputEnabled = isTextInputEnabled;
                                readTags();
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
            hub.sendStoryMessage(message, $scope.game.GameId, $scope.authentication.userName, $scope.game.currentRound, $scope.timeLeft, $scope.chosenWord);
        };

        $scope.sendInput = function () {
            hub.sendInput($scope.game.GameId, $scope.authentication.userName);
        };

        $scope.chooseWord = function (word) {
            $scope.message += " " + word;
            $scope.chosenWord = word;
            $scope.wordChosen = true;
        };

        function readTags() {
            $http({ method: 'GET', url: ngAuthSettings.apiServiceBaseUri + 'api/hashtag/random' }).
               success(function (data, status, headers, config) {
                   if (data === null) {
                       e.error();
                   } else {
                       if (data.length >= 0) {
                           for (var i = 0; i < data.length; i++) {
                               if (i == 0)
                                   $scope.word1 = data[0].Hashtag;
                               else if (i == 1)
                                   $scope.word2 = data[1].Hashtag;
                               else if (i == 2)
                                   $scope.word3 = data[2].Hashtag;
                               else if (i == 3)
                                   $scope.word4 = data[3].Hashtag;
                           }
                       }
                   }
               }).
               error(function (data, status, headers, config) {
                   toastr.error('Fehler beim Lesen der Hashtags: ' + data);
               });
        }

        function safeApply(scope, root, fn) {
            (scope.$$phase || (root.$$phase)) ? fn() : scope.$apply(fn);
        }

        if ($scope.isTextInputEnabled) {
            callCountdown();
        }

}]);
