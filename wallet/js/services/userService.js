/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', '$location', '$rootScope', 'config', 'localStorageService',
        'walletService', 'keyService', 'signatureService', 'sessionStorageService'];

    var userFactory = function ($http, $window, $location, $rootScope, config, localStorageService,
                                walletService, keyService, signatureService, sessionStorageService) {

        var identityBase = config.identityHost,
            loginDomain = config.defaultDomain,
            factory = {};

        factory.getContext = function () {
            return sessionStorageService.getAuthToken();
        };

        factory.validateCredentials = function (userName, password) {
            return keyService.validateCredentials(userName, password);
        };

        factory.logout = function () {
            var result = sessionStorageService.deleteAuthToken();
            $rootScope.$broadcast('logoutEvent', {result: result});
            return result;
        };

        //note: errors handled by httpInterceptor
        factory.login = function (userName, password, domain) {

            // validate the credentials before we do anything
            if (factory.validateCredentials(userName, password)) {

                //create a challenge
                var challengeData = {username: userName};

                return $http.post(identityBase + '/challenge', challengeData, {'withCredentials': false})
                    .then(function (response) {

                        //sign the challenge
                        var challengeResponse = response.data;
                        var signedChallenge = signatureService.sign(userName, password, challengeResponse.data);
                        var shouldRedirect = !!((domain != null) && (domain != ''));

                        console.debug('Domain: ' + domain);

                        var loginData = {
                            username: userName,
                            challenge: signedChallenge,
                            domain: ((domain != null) && (domain != '')) ? domain : loginDomain,
                            redirect: shouldRedirect
                        };

                        //now login
                        $http.post(identityBase + '/login', loginData, {'withCredentials': false})
                            .then(function (response) {
                                var loginResponse = response.data;

                                if(shouldRedirect) {
                                    console.debug('Redirect uri: ' + loginResponse.redirect_uri);
                                    $window.location.href = loginResponse.redirect_uri;
                                }else {
                                    sessionStorageService.saveAuthToken(userName, loginResponse.external_id,
                                        loginResponse.external_id, loginResponse.role, loginResponse.token);

                                    $rootScope.$broadcast('loginEvent', {redirect: true, redirectUrl: '/connections'});
                                }
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

                    // invoke modal
                    $rootScope.$broadcast('modalEvent', {
                        type: 'Wallet updated',
                        message: "Wallet successfully updated",
                        redirect : true,
                        redirectUrl : '/'
                    });
                });
        };

        return factory;
    };

    userFactory.$inject = injectParams;

    angular.module('id-io').factory('userService', userFactory);

}());