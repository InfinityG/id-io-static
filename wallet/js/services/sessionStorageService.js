/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = [];

    var sessionStorageFactory = function () {

        var factory = {};

        factory.getAuthToken = function(){
            return JSON.parse(sessionStorage.getItem('id-io.token'));
        };

        factory.saveAuthToken = function(username, userId, externalId, role, token){
            return sessionStorage.setItem('id-io.token', JSON.stringify({username: username, userId: userId,
                                            externalId : externalId, role: role, token: token}));
        };

        factory.deleteAuthToken = function(){
            return sessionStorage.removeItem('id-io.token');
        };

        return factory;
    };

    sessionStorageFactory.$inject = injectParams;

    angular.module('id-io').factory('sessionStorageService', sessionStorageFactory);

}());