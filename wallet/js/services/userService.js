/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$location', '$rootScope', 'config', 'keyService', 'signatureService', 'sessionStorageService'];

    var userFactory = function ($http, $location, $rootScope, config, keyService, signatureService, sessionStorageService) {

        var identityBase = config.identityHost,
            loginDomain = config.loginDomain,
            factory = {};

        factory.getContext = function () {
            return sessionStorageService.getAuthToken();
        };

        factory.logout = function () {
            var result = sessionStorageService.deleteAuthToken();
            $rootScope.$broadcast('logoutEvent', {result: result});
            return result;
        };

        //note: errors handled by httpInterceptor
        factory.login = function (userName, password) {

            // validate the credentials before we do anything
            keyService.validateCredentials(userName, password);

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
        };

        return factory;
    };

    userFactory.$inject = injectParams;

    angular.module('id-io').factory('userService', userFactory);

}());