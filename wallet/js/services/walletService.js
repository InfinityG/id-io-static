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

        factory.generateWallet = function (userName, password, publicKey, secretKey) {
            var cryptoKey = keyService.generateAESKey(password, nacl);
            var encryptedSecret = cryptoService.encryptSecret(cryptoKey, secretKey);
            console.debug(encryptedSecret);
            var wallet = {keys: {pk: publicKey.toString('base64'), sk: encryptedSecret}};

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