(function () {
    var injectParams = ['config', 'localStorageService', 'cryptoService', 'sessionStorageService'];

    var keyFactory = function (config, localStorageService, cryptoService, sessionStorageService) {

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
            return cryptoUtil.AES.generateAESKey(password, salt);
        };

        factory.validateCredentials = function(userName, password){
            var encryptedSecret = factory.getSigningKeyPair(userName).sk;
            var cryptoKey = cryptoService.generateAESKey(password, nacl);
            return cryptoService.validateAESKey(cryptoKey, encryptedSecret);
        };

        return factory;
    };

    keyFactory.$inject = injectParams;

    angular.module('id-io').factory('keyService', keyFactory);

}());