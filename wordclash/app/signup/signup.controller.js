'use strict';
angular.module('wordclashApp').controller('SignupCtrl', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        email:"",
        userName: "",
        password: "",
        confirmPassword: ""
    };
    $scope.clicked = false;
    $scope.signUp = function () {
        $scope.clicked = true;
        authService.saveRegistration($scope.registration).then(function (response) {
            $scope.clicked = false;
            $scope.savedSuccessfully = true;
            $scope.message = "Ihr Benutzer wurde erfolgreich registriert. Sie werden in wenigen augenblicken auf die Login-Seite weitergeleitet";
            startTimer();

        },
         function (response) {
             $scope.clicked = false;
             var errors = [];
             for (var key in response.data.ModelState) {
                 for (var i = 0; i < response.data.ModelState[key].length; i++) {
                     errors.push(response.data.ModelState[key][i]);
                 }
             }
             $scope.message = "Fehler bei der Registrierung:" + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);