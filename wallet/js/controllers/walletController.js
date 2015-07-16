(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'config', 'userService',
        'keyService', 'cryptoService', 'localStorageService'];

    var WalletController = function ($scope, $rootScope, $location, $routeParams, $window, config, userService,
                                     keyService, cryptoService, localStorageService) {

        $scope.encodedPublicKey = null;
        $scope.rawSecretKey = null;
        $scope.encodedSecretKey = null;

        $scope.cryptoKey = null;

        $scope.userValidated = false;
        $scope.userName = null;

        $scope.password = null;
        $scope.passwordValidated = false;
        $scope.newPassword = null;

        function init() {
            var context = userService.getContext();

            if (context != null) {
                $scope.userName = context.userName;
            } else
                $location.path('/login');
        }

        var credentialsEnteredEventListener = $rootScope.$on('credentialsEnteredEvent', function (event, args) {
            credentialsEntered(args.credentials);
        });

        $scope.showKeys = function () {
            //now invoke the credentials modal
            $rootScope.$broadcast('enterCredentialsEvent', {});
        };

        function credentialsEntered(credentials) {
            $scope.password = credentials.password;
            $scope.newPassword = credentials.password;
            $scope.passwordValidated = true;
            $scope.loadUserWallet();
        }

        $scope.loadUserWallet = function () {
            var wallet = localStorageService.getWallet($scope.userName);

            if (wallet != null) {
                $scope.encodedPublicKey = wallet.keys.pk;   //the public key is stored encoded
                $scope.rawSecretKey = keyService.getSecretKey($scope.userName, $scope.password);
                $scope.encodedSecretKey = $scope.rawSecretKey.toString('base64');
            }
        };

        $scope.regenerateKeys = function () {
            var rawKeyPair = keyService.generateSigningKeyPair();

            $scope.encodedPublicKey = rawKeyPair.pk.toString('base64');
            $scope.rawSecretKey = rawKeyPair.sk;
            $scope.encodedSecretKey = $scope.rawSecretKey.toString('base64');
        };

        $scope.saveWallet = function () {
            userService.update($scope.userName, $scope.password, $scope.newPassword,
                                $scope.encodedPublicKey, $scope.rawSecretKey);
        };

        //clean up rootScope listeners
        $scope.$on('$destroy', function () {
            credentialsEnteredEventListener();
        });

        init();
    };

    WalletController.$inject = injectParams;

    angular.module('id-io').controller('WalletController', WalletController);

}());