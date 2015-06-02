(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'config', 'contextService',
        'keyService', 'cryptoService', 'localStorageService'];

    var WalletController = function ($scope, $rootScope, $location, $routeParams, $window, config, contextService,
                                     keyService, cryptoService, localStorageService) {

        $scope.currentWallet = null;
        $scope.currentKeyPair = null;
        $scope.publicKey = null;
        $scope.secretKey = null;
        $scope.cryptoKey = null;

        $scope.userValidated = false;
        $scope.passwordValidated = false;
        $scope.userName = null;
        $scope.password = null;

        function init() {
            var context = contextService.getContext();

            if (context != null)
                $scope.userName = context.userName;
        }

        $scope.goRegister = function () {
            $location.path('/register')
        };

        $scope.login = function (userName, password) {

            $scope.loadUserWallet(userName);

            if ($scope.currentWallet != null) {
                $scope.validatePassword(password);
            } else {
                $rootScope.$broadcast('loginEvent', {
                    type: 'Error',
                    status: 0,
                    message: "Invalid user!"
                });
                return;
            }

            if ($scope.passwordValidated)
                $rootScope.$broadcast('loginEvent', {userName: userName});
            else
                $scope.reset();
        };

        $scope.reset = function () {
            $scope.userName = null;
            $scope.password = null;
            $scope.currentWallet = null;
            $scope.currentKeyPair = null;
            $scope.publicKey = null;
            $scope.secretKey = null;
        };

        $scope.loadUserWallet = function (userName) {
            var wallet = localStorageService.getWallet(userName);

            if (wallet != null) {
                $scope.userName = userName;
                $scope.currentWallet = wallet;
                $scope.currentKeyPair = wallet.keys;
                $scope.publicKey = wallet.keys.pk;
                $scope.secretKey = wallet.keys.sk;
            }
        };

        $scope.validatePassword = function (password) {
            var cryptoKey = keyService.generateAESKey(password, config.nacl);

            if (cryptoService.validateAESKey(cryptoKey, $scope.secretKey)) {
                $scope.passwordValidated = true;
                $scope.cryptoKey = cryptoKey;
                $scope.loadDecryptedSecret(cryptoKey, $scope.secretKey);
            } else {
                $scope.password = null;
                $scope.passwordValidated = false;
                $scope.cryptoKey = null;
            }
        };

        $scope.loadDecryptedSecret = function (cryptoKey, encryptedSecret) {
            $scope.secretKey = cryptoService.decryptString(cryptoKey, encryptedSecret);
        };

        $scope.regenerateKeys = function () {
            var pair = keyService.generateSigningKeyPair();
            $scope.publicKey = pair.pk;
            $scope.secretKey = pair.sk;
        };

        $scope.saveWallet = function () {
            //re-encrypt the secret (with the new password if it has changed)
            $scope.cryptoKey = keyService.generateAESKey($scope.password, config.nacl);
            var encryptedSecret = cryptoService.encryptString($scope.cryptoKey, $scope.secretKey);

            if (encryptedSecret != null) {
                $scope.currentWallet.keys.sk = encryptedSecret;
                $scope.currentWallet.keys.pk = $scope.publicKey;

                localStorageService.saveWallet($scope.userName, $scope.currentWallet);

                $rootScope.$broadcast('walletUpdateEvent', {
                    type: 'Success',
                    message: 'Wallet updated!',
                    userName: $scope.userName
                });
            }
        };

        init();
    };

    WalletController.$inject = injectParams;

    angular.module('id-io').controller('WalletController', WalletController);

}());