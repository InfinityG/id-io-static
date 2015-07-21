/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'keyService', 'walletService', 'signatureService', 'blobService',
        'sessionStorageService'];

    var registrationFactory = function ($http, $rootScope, config, keyService, walletService, signatureService, blobService,
                                        sessionStorageService) {

        var identityBase = config.identityHost,
            loginDomain = config.defaultDomain,
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

                            $rootScope.$broadcast('loginEvent', {redirect: false, redirectUrl: null});

                            // invoke modal
                            $rootScope.$broadcast('modalEvent', {
                                type: "Congratulations " + userName + "!",
                                message: "You've successfully registered on ID-IO! If you forgot to save your keys, don't " +
                                "worry, you can always find them in 'my wallet'. You will now be taken to 'my " +
                                "connections' where you can connect to other users...",
                                status: 0,
                                redirect : true,
                                redirectUrl : '/connections'
                            });
                        });
                });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('id-io').factory('registrationService', registrationFactory);

}());