/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'userService', 'keyService',
        'cryptoService', 'blobService', 'localStorageService'];

    var connectionFactory = function ($http, $rootScope, config, userService, keyService,
                                      cryptoService, blobService, localStorageService) {

        var identityBase = config.identityHost, nacl = config.nacl, factory = {};

        factory.getConnections = function () {
            var context = userService.getContext();
            return localStorageService.getConnections(context.userName);
        };

        factory.refreshConnections = function () {
            var context = userService.getContext();

            return $http.get(identityBase + '/connections', {headers: {'Authorization': context.token}})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveConnections(context.userName, data);

                    $rootScope.$broadcast('connectionEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'Connections updated'
                    });
                });
        };

        factory.confirmConnection = function (connectionId, password) {
            var context = userService.getContext();
            var requestData = generateConfirmationPayload(password);

            return $http.post(identityBase + '/connections/' + connectionId, requestData, {headers: {'Authorization': context.token}})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveConnection(context.userName, data);

                    $rootScope.$broadcast('connectionConfirmedEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'Connection confirmed'
                    });
                });
        };

        function generateConfirmationPayload(password) {
            // get the decrypted key
            var cryptoKey = keyService.generateAESKey(password, nacl);
            var encryptedSecret = localStorageService.getKeyPair().sk;
            var secret = cryptoService.decrypt(cryptoKey, encryptedSecret);

            // generate a digest, then sign it...
            var digest = cryptoService.createMessageDigest(context.username);
            var secretBuffer = cryptoService.base64Decode(secret);
            var signature = cryptoService.signMessage(digest, secretBuffer);

            return {"data": digest.toString('base64'), "signature": signature.toString('base64')};
        }

        return factory;
    };

    connectionFactory.$inject = injectParams;

    angular.module('id-io').factory('connectionService', connectionFactory);

}());