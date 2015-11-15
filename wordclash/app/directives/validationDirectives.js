'use strict';

angular.module('wordclashApp').directive('maxLength', function () {
    // Description:
    //  Checks if the text length of a textbox is less then the max-value
    // Usage:
    //  <input type="text" data-max-length="maxvalue" />
    var directive = {
        require: 'ngModel',
        link: link
    };
    return directive;

    function link(scope, element, attrs, ngModel) {
        var maxvalue = attrs.maxLength;
        ngModel.$parsers.unshift(function (value) {
            var val = value.length;
            var max = parseFloat(maxvalue);
            if (val <= max)
                return value;
            else
                return value.substring(0, max-1);
        });
    }
});