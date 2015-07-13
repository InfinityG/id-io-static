(function () {

    var injectParams = ['$scope', '$rootScope', '$location'];

    var ModalController = function ($scope, $rootScope, $location) {
        $scope.show = false;
        $scope.message = null;
        $scope.type = null;
        $scope.status = null;
        $scope.redirectUri = '/';

        $scope.cancelModal = function () {
            $scope.show = false;

            //redirect=false/true is set on the modalDirective when placed on a page
            if ($scope.redirect) {
                $location.path($scope.redirectUri);
            }
        };

        var errorEventListener = $rootScope.$on('errorEvent', function (event, args) {
            showModal(args.type, args.message, 0, null);
        });

        var unauthorizedEventListener = $rootScope.$on('unauthorizedEvent', function (event, args) {
            showModal(args.type, args.message, 0, '/login');
        });

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            if (args.type == 'Error')
                showModal(args.type, args.message, 0, '/login');
        });

        var registrationEventListener = $rootScope.$on('registrationEvent', function (event, args) {
            if (args.type == 'Error')
                showModal(args.type, args.message, 0, '/register');
            else
                showModal(args.type, args.message, 0, '/');
        });

        var walletUpdateEventListener = $rootScope.$on('walletUpdateEvent', function (event, args) {
            showModal(args.type, args.message, 0, '/');
        });

        var connectionConfirmedEventListener = $rootScope.$on('connectionConfirmedEvent', function (event, args) {
            showModal(args.type, args.message, 0, '/connections');
        });

        var encryptionEventListener = $rootScope.$on('encryptionEvent', function (event, args) {
            showModal(args.type, args.message, 0, '/login');
        });

        //clean up rootScope listeners
        $scope.$on('$destroy', function () {
            errorEventListener();
            unauthorizedEventListener();
            loginEventListener();
            registrationEventListener();
            walletUpdateEventListener();
            connectionConfirmedEventListener();
            encryptionEventListener();
        });

        function showModal(type, message, status, redirectUri) {
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
            $scope.redirectUri = redirectUri;
        }
    };

    ModalController.$inject = injectParams;

    angular.module('id-io').controller('ModalController', ModalController);

}());