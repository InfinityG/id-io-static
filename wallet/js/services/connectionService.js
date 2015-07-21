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
                });
        };

        factory.createConnection = function (connectionUserName, password, callbackFunc) {
            var context = userService.getContext();
            var requestData = generateCreationPayload(connectionUserName, password);

            return $http.post(identityBase + '/connections', requestData, {headers: {'Authorization': context.token}})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveConnection(context.userName, data);
                    callbackFunc();

                    // invoke modal
                    $rootScope.$broadcast('modalEvent', {
                        type: 'Connection created',
                        message: "Connection successfully created",
                        redirect : false,
                        redirectUrl : null
                    });
                });
        };

        factory.updateConnection = function (connectionId, status, password, callbackFunc) {
            var context = userService.getContext();
            var requestData = generateConfirmationPayload(status, password);

            return $http.post(identityBase + '/connections/' + connectionId, requestData, {headers: {'Authorization': context.token}})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveConnection(context.userName, data);
                    callbackFunc();

                    // invoke modal
                    $rootScope.$broadcast('modalEvent', {
                        type: 'Connection updated',
                        message: "Connection successfully updated",
                        redirect : false,
                        redirectUrl : null
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

        function generateConfirmationPayload(status, password) {
            var context = userService.getContext();
            var secret = keyService.getSecretKey(context.userName, password);

            // generate a digest, then sign it...
            var digest = cryptoService.createMessageDigest(context.userName);
            var signature = cryptoService.signMessage(digest, secret);

            return {
                "digest": digest.toString('base64'),
                "signature": signature.toString('base64'),
                "status":status
            };
        }

        return factory;
    };

    connectionFactory.$inject = injectParams;

    angular.module('id-io').factory('connectionService', connectionFactory);

}());