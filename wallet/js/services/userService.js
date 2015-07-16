/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$location', '$rootScope', 'config', 'localStorageService',
        'walletService', 'keyService', 'signatureService', 'sessionStorageService'];

    var userFactory = function ($http, $location, $rootScope, config, localStorageService,
                                walletService, keyService, signatureService, sessionStorageService) {

        var identityBase = config.identityHost,
            loginDomain = config.loginDomain,
            factory = {};

        factory.getContext = function () {
            return sessionStorageService.getAuthToken();
        };

        factory.validateCredentials = function (userName, password) {
            var userExists = localStorageService.getBlob(userName) != null;

            if (!userExists) {
                $rootScope.$broadcast('loginEvent', {
                    type: 'Error',
                    message: "User cannot be found! Ensure you are registered and that your username is correct " +
                    "(if you need to restore your wallet, use the 'restore' link)."
                });

                return false;
            }

            // this will also raise an event if the password does not validate
            return keyService.validateCredentials(userName, password);
        };

        factory.logout = function () {
            var result = sessionStorageService.deleteAuthToken();
            $rootScope.$broadcast('logoutEvent', {result: result});
            return result;
        };

        //note: errors handled by httpInterceptor
        factory.login = function (userName, password) {

            // validate the credentials before we do anything
            if (factory.validateCredentials(userName, password)) {

                //create a challenge
                var challengeData = {username: userName};

                return $http.post(identityBase + '/challenge', challengeData, {'withCredentials': false})
                    .then(function (response) {

                        //sign the challenge
                        var challengeResponse = response.data;
                        var signedChallenge = signatureService.sign(userName, password, challengeResponse.data);
                        var loginData = {username: userName, challenge: signedChallenge, domain: loginDomain};

                        //now login
                        $http.post(identityBase + '/login', loginData, {'withCredentials': false})
                            .then(function (response) {
                                var loginResponse = response.data;

                                sessionStorageService.saveAuthToken(userName, loginResponse.external_id,
                                    loginResponse.external_id, loginResponse.role, loginResponse.token);

                                $rootScope.$broadcast('loginEvent', {
                                    userName: userName,
                                    userId: loginResponse.external_id,
                                    role: loginResponse.role
                                });
                            });
                    });
            }
        };

        factory.update = function (userName, originalPassword, newPassword, encodedPublicKey, rawSecretKey) {
            // create the signature (sign the userName) - use the ORIGINAL keys for this
            var sig = signatureService.sign(userName, originalPassword, userName);

            // payload contains the new keys
            var requestData = {
                'password': newPassword,
                'public_key': encodedPublicKey,
                'digest': sig.digest,
                'signature': sig.signature
            };

            var context = factory.getContext();

            return $http.post(identityBase + '/users/' + userName, requestData, {headers: {'Authorization': context.token}})
                .then(function (response) {
                    //var data = response.data;
                    walletService.updateWallet(userName, newPassword, encodedPublicKey, rawSecretKey);

                    $rootScope.$broadcast('walletUpdateEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'Wallet successfully updated'
                    });
                });
        };

        return factory;
    };

    userFactory.$inject = injectParams;

    angular.module('id-io').factory('userService', userFactory);

}());