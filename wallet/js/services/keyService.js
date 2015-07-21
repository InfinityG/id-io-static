(function () {
    var injectParams = ['$rootScope', 'config', 'localStorageService', 'cryptoService', 'sessionStorageService'];

    var keyFactory = function ($rootScope, config, localStorageService, cryptoService, sessionStorageService) {

        var nacl = config.nacl, factory = {};

        /*
         WALLET SECRET KEY SHARING
         */

        factory.getSplitWalletSecret = function (wallet) {
            var secret = wallet.secret;
            var result = secrets.share(secrets.str2hex(secret), 2, 2);

            //var str1 = result[0].toString('base64');
            //var str2 = result[1].toString('base64');

            return result;
        };

        factory.saveSsPair = function (ssPair) {
            var userId = sessionStorageService.getAuthToken().userId;
            localStorageService.saveSsPair(userId, ssPair);
        };

        /*
         ASYMMETRIC ENCRYPTION - ECDSA signature keys
         */

        factory.generateSigningKeyPair = function () {
            return cryptoService.generateSigningKeyPair();
        };

        factory.getSigningKeyPair = function (userName) {
            return localStorageService.getKeyPair(userName);
        };

        factory.saveSigningKeyPair = function (userName, pair) {
            localStorageService.saveKeyPair(userName, pair);
        };

        factory.getSecretKey = function(userName, password){
            var cryptoKey = cryptoService.generateAESKey(password, nacl);
            var encryptedSecret = factory.getSigningKeyPair(userName).sk;
            return cryptoService.decryptSecret(cryptoKey, encryptedSecret);
        };

        /*
         SYMMETRIC ENCRYPTION - AES key generation
         */

        factory.generateAESKey = function (password, salt) {
            return cryptoService.generateAESKey(password, salt);
        };

        factory.validateCredentials = function(userName, password){
            var userExists = localStorageService.getBlob(userName) != null;

            if (!userExists) {
                // invoke modal
                $rootScope.$broadcast('modalEvent', {
                    type: 'Error',
                    message: "User cannot be found. Do you need to restore your wallet?",
                    redirect : true,
                    redirectUrl : '/login'
                });

                return false;
            }

            var decryptedSecret = factory.getSecretKey(userName, password);

            //generate a signature and validate it
            var wallet = localStorageService.getWallet(userName);
            var keyString = JSON.stringify(wallet.keys);
            var digest = cryptoService.createMessageDigest(keyString);
            var signature = cryptoService.signMessage(digest, decryptedSecret);

            //now validate
            var isValid = cryptoService.validateSignature(digest, signature, wallet.keys.pk);

            if(!isValid){
                // invoke modal
                $rootScope.$broadcast('modalEvent', {
                    type: 'Access denied',
                    message: "Please ensure that your credentials are correct.",
                    redirect : true,
                    redirectUrl : '/login'
                });
            }

            return isValid;
        };

        return factory;
    };

    keyFactory.$inject = injectParams;

    angular.module('id-io').factory('keyService', keyFactory);

}());