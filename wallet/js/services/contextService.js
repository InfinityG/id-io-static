/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$location', '$rootScope', 'config'];

    var contextFactory = function ($http, $location, $rootScope, config) {

        var factory = {};

        factory.getContext = function () {
            return config.context;
        };

        factory.createContext = function(val){
            config.context = val;
        };

        factory.deleteContext = function () {
            config.context = null;
            //$rootScope.$broadcast('logoutEvent');
        };

        return factory;
    };

    contextFactory.$inject = injectParams;

    angular.module('id-io').factory('contextService', contextFactory);

}());