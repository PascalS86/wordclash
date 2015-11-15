'use strict';
angular.module('wordclashApp').factory('colorService', [function () {

    var colorServiceFactory = {};

    var _gamerColor = function (idx) {
        if (idx % 5 === 0) {
            return { "background": "#64CCEC" };
        } else if (idx % 5 === 1) {
            return { "background": "#FD856A" };
        } else if (idx % 5 === 2) {
            return { "background": "#4393B9" };
        } else if (idx % 5 === 3) {
            return { "background": "#267BA4" };
        } else {
            return { "background": "#0C648E" };
        }
    };

    colorServiceFactory.gamerColor = _gamerColor;
    

    return colorServiceFactory;
}]);