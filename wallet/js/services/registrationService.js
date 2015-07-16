/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'keyService', 'walletService', 'signatureService', 'blobService',
        'sessionStorageService'];

    var registrationFactory = function ($http, $rootScope, config, keyService, walletService, signatureService, blobService,
                                        sessionStorageService) {

        var identityBase = config.identityHost,
            loginDomain = config.loginDomain,
            factory = {};

        factory.generateKeys = function () {
            return keyService.generateSigningKeyPair();
        };

        factory.register = function (firstName, lastName, userName, password, rawPublicKey, rawSecretKey) {

            var encodedPublicKey = rawPublicKey.toString('base64');

            var userData = {
                first_name: firstName,
                last_name: lastName,
                username: userName,
                password: password,
                public_key: encodedPublicKey
            };

            //note: errors handled by httpInterceptor
            return $http.post(identityBase + '/users', userData, {'withCredentials': false})
                .then(function (response) {
                    var regResponse = response.data;

                    // initialise the local blob
                    blobService.initializeBlob(userName);

                    // generate a wallet
                    walletService.generateWallet(userName, password, encodedPublicKey, rawSecretKey);

                    // now do a signed login
                    var signedChallenge = signatureService.sign(userName, password, regResponse.challenge.data);
                    var loginData = {username: userName, challenge: signedChallenge, domain: loginDomain};

                    $http.post(identityBase + '/login', loginData, {'withCredentials': false})
                        .then(function (response) {
                            var loginResponse = response.data;

                            sessionStorageService.saveAuthToken(userName, loginResponse.external_id,
                                loginResponse.external_id, loginResponse.role, loginResponse.token);

                            // invoke modal
                            $rootScope.$broadcast('modalEvent', {
                                type: 'User successfully registered',
                                message: "You have successfully registered. You have been automatically logged in.",
                                status: 0,
                                redirect : true,
                                redirectUrl : '/'
                            });
                        });
                });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('id-io').factory('registrationService', registrationFactory);

}());