(function () {

    var injectParams = ['$scope', '$rootScope', '$location'];

    var ModalController = function ($scope, $rootScope, $location) {
        $scope.show = false;
        $scope.message = null;
        $scope.type = null;
        $scope.status = null;
        $scope.redirectUri = '/';

        $scope.cancelModal = function(){
            $scope.show = false;

            //redirect=false/true is set on the modalDirective when placed on a page
            if($scope.redirect){
                $location.path($scope.redirectUri);
            }
        };

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            if(args.type == 'Error')
                showModal(args.type, args.message, 0, '/wallet');
        });

        var registrationEventListener = $rootScope.$on('registrationEvent', function (event, args) {
            if(args.type == 'Error')
                showModal(args.type, args.message, 0, '/register');
            else
                showModal(args.type, args.message, 0, '/wallet');
        });

        var walletUpdateEventListener = $rootScope.$on('walletUpdateEvent', function (event, args) {
            showModal(args.type, args.message, 0, '/');
        });

        var encryptionEventListener = $rootScope.$on('encryptionEvent', function (event, args) {
            if(args.type == 'Error')
                showModal(args.type, args.message, 0, '/');
            else
                showModal(args.type, args.message, 0, '/wallet');
        });

        //clean up rootScope listeners
        $scope.$on('$destroy', function() {
            loginEventListener();
            registrationEventListener();
            walletUpdateEventListener();
            encryptionEventListener();
        });

        function showModal(type, message, status, redirectUri){
            $scope.show = true;
            $scope.type = type;
            $scope.message = message;
            $scope.status = status;
            $scope.redirectUri = redirectUri;
        }
    };

    ModalController.$inject = injectParams;

    angular.module('id-io').controller('ModalController', ModalController);

}());