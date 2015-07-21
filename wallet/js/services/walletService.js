/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$rootScope', 'config', 'contextService', 'keyService', 'cryptoService', 'localStorageService'];

    var walletFactory = function ($rootScope, config, contextService, keyService, cryptoService, localStorageService) {

        var nacl = config.nacl, factory = {};

        factory.getWallet = function (userName) {
            return localStorageService.getWallet(userName);
        };

        factory.generateWallet = function (userName, password, encodedPublicKey, rawSecretKey) {
            var cryptoKey = keyService.generateAESKey(password, nacl);
            var encryptedSecret = cryptoService.encryptSecret(cryptoKey, rawSecretKey);

            //create a signature and digest
            var keyString = JSON.stringify({pk: encodedPublicKey, sk: encryptedSecret});
            var digest = cryptoService.createMessageDigest(keyString);
            var signature = cryptoService.signMessage(digest, rawSecretKey);

            //create wallet
            var wallet = {
                signature: signature.toString('base64'),
                keys: {
                    pk: encodedPublicKey,
                    sk: encryptedSecret
                }
            };

            localStorageService.saveWallet(userName, wallet);
        };

        factory.updateWallet = function (userName, password, encodedPublicKey, rawSecretKey) {
            var cryptoKey = keyService.generateAESKey(password, nacl);
            var encryptedSecret = cryptoService.encryptSecret(cryptoKey, rawSecretKey);

            var wallet = factory.getWallet(userName);

            //create a signature and digest
            var keyString = JSON.stringify({pk: encodedPublicKey, sk: encryptedSecret});
            var digest = cryptoService.createMessageDigest(keyString);
            var signature = cryptoService.signMessage(digest, rawSecretKey);

            wallet.signature = signature.toString('base64');
            wallet.keys.pk = encodedPublicKey;
            wallet.keys.sk = encryptedSecret;

            localStorageService.saveWallet(userName, wallet);
        };

        factory.saveWallet = function (wallet) {
            var userName = contextService.getContext().userName;
            localStorageService.saveWallet(userName, wallet);
        };

        return factory;
    };

    walletFactory.$inject = injectParams;

    angular.module('id-io').factory('walletService', walletFactory);

}());