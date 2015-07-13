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

        factory.createConnection = function (connectionUserName, password) {
            var context = userService.getContext();
            var requestData = generateCreationPayload(connectionUserName, password);

            return $http.post(identityBase + '/connections', requestData, {headers: {'Authorization': context.token}})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveConnection(context.userName, data);

                    $rootScope.$broadcast('connectionCreatedEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'Connection confirmed'
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

        function generateCreationPayload(connectionUsername, password) {
            var context = userService.getContext();
            var secret = keyService.getSecretKey(context.userName, password);

            // generate a digest, then sign it...
            var digest = cryptoService.createMessageDigest(connectionUsername);
            var signature = cryptoService.signMessage(digest, secret);

            return {
                "username": connectionUsername,
                "digest": digest.toString('base64'),
                "signature": signature.toString('base64')
            };
        }

        function generateConfirmationPayload(password) {
            var context = userService.getContext();
            var secret = keyService.getSecretKey(context.userName, password);

            // generate a digest, then sign it...
            var digest = cryptoService.createMessageDigest(context.userName);
            var signature = cryptoService.signMessage(digest, secret);

            return {
                "digest": digest.toString('base64'),
                "signature": signature.toString('base64'),
                "status":"connected"
            };
        }

        return factory;
    };

    connectionFactory.$inject = injectParams;

    angular.module('id-io').factory('connectionService', connectionFactory);

}());