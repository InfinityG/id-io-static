/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$rootScope', 'contextService', 'localStorageService'];

    var walletFactory = function ($rootScope, contextService, localStorageService) {

        var factory = {};

        factory.getWallet = function(userName){
            return localStorageService.getWallet(userName);
        };

        factory.saveWallet = function(wallet){
            var userName = contextService.getContext().userName;
            localStorageService.saveWallet(userName, wallet);
        };

        return factory;
    };

    walletFactory.$inject = injectParams;

    angular.module('id-io').factory('walletService', walletFactory);

}());