/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', 'keyService', 'cryptoService', 'localStorageService'];

    var blobFactory = function ($http, keyService, cryptoService, localStorageService) {

        var factory = {};

        factory.initializeBlob = function(userName){
            if(factory.getBlob(userName) == null) {
                var userBlob = factory.getBlobTemplate();
                factory.saveBlob(userName, userBlob);
            }
        };

        factory.getBlob = function (userName) {
            return localStorageService.getBlob(userName);
        };

        factory.saveBlob = function (userName, blob) {
            localStorageService.saveBlob(userName,blob);
        };

        factory.getBlobTemplate = function () {
            return {wallet: null}
        };

        return factory;
    };

    blobFactory.$inject = injectParams;

    angular.module('id-io').factory('blobService', blobFactory);

}());