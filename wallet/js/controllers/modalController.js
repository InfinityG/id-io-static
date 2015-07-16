(function () {

    var injectParams = ['$scope', '$rootScope', '$location'];

    var ModalController = function ($scope, $rootScope, $location) {
        $scope.show = false;
        $scope.message = null;
        $scope.type = null;
        $scope.status = null;
        $scope.redirect = false;
        $scope.redirectUri = '/';

        $scope.cancelModal = function () {
            $scope.show = false;

            //redirect=false/true is set on the modalDirective when placed on a page
            if ($scope.redirect) {
                $location.path($scope.redirectUri);
            }
        };

        var genericEventListener = $rootScope.$on('modalEvent', function (event, args) {
            $scope.showModal(args.type, args.message, args.status, args.redirect, args.redirectUrl);
        });

        //clean up rootScope listeners
        $scope.$on('$destroy', function () {
            genericEventListener();
        });

        $scope.showModal = function(type, message, status, redirect, redirectUri) {
            if (message.errors != null) {
                var errorMessage = '';

                for (var x = 0; x < message.errors.length; x++) {
                    errorMessage += message.errors[x] + ', ';
                }

                $scope.message = errorMessage.substring(0, errorMessage.length - 2);
            } else {
                $scope.message = message;
            }

            $scope.show = true;
            $scope.type = type;
            $scope.status = status;
            $scope.redirect = redirect;
            $scope.redirectUri = redirectUri;
        };
    };

    ModalController.$inject = injectParams;

    angular.module('id-io').controller('ModalController', ModalController);

}());