/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['config', 'keyService', 'cryptoService'];

    var signatureFactory = function (config, keyService, cryptoService) {

        var factory = {};

        factory.sign = function (userName, password, data) {
            var secret = keyService.getSecretKey(userName, password);
            var digest = cryptoService.createMessageDigest(data);
            var signature = cryptoService.signMessage(digest, secret);

            return {'digest': digest.toString('base64'), 'signature': signature.toString('base64')};

        };

        return factory;
    };

    signatureFactory.$inject = injectParams;

    angular.module('id-io').factory('signatureService', signatureFactory);

}());