'use strict';
angular.module('wordclashApp').factory('modalService', ['$modal', '$templateCache', function ($modal, $templateCache) {

    var modalServiceFactory = {};

    //Template for a simple ModalDialog with no Cancel-Option
    $templateCache.put('modalDialogNoCancel.tpl.html',
           '<div>' +
           '    <div class="modal-header">' +
           '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="ok()">&times;</button>' +
           '        <h3>{{title}}</h3>' +
           '    </div>' +
           '    <div class="modal-body">' +
           '        <div ng-bind-html="renderHtml()"></div>' +
           '    </div>' +
           '    <div class="modal-footer">' +
           '        <button class="btn btn-info" data-ng-click="ok()">{{okText}}</button>' +
           '    </div>' +
           '</div>');

    // Controller for modal Dialog
    var modalInstance = ['$scope', '$sce', '$modalInstance', 'options',
        function ($scope, $sce, $modalInstance, options) {
            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.renderHtml = function () {
                return $sce.trustAsHtml($scope.message);
            }
            $scope.okText = options.okText || 'Ok';
            $scope.cancelText = options.cancelText || 'Abbrechen';
            $scope.ok = function () { $modalInstance.close('ok'); };
            $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
        }];

    // Shows a modal Dialog
    var _showDialog = function (title, msg) {
        var modalOptions = {
            templateUrl: 'modalDialogNoCancel.tpl.html',
            controller: modalInstance,
            keyboard: true,
            resolve: {
                options: function () {
                    return {
                        title: title,
                        message: msg
                    };
                }
            }
        };

        return $modal.open(modalOptions).result;
    };

    modalServiceFactory.showDialog = _showDialog;

    return modalServiceFactory;
}]);