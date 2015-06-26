/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', '$location', 'contextService', 'blobService'];

    var configValue = {
        identityHost: 'https://id-io.infinity-g.com',
        confirmMobile: false,
        nacl: '9612700b954743e0b38f2faff35d264c',
        context: null
    };

    var initializationFactory = function ($http, $rootScope, $location, contextService, blobService) {
        var factory = {};

        factory.init = function(){
            factory.start(null);
            factory.setupListener();
        };

        factory.start = function(key){
            $http.defaults.withCredentials = false; //this is so that we can use '*' in allowed-origin

            var context = contextService.getContext();

            if(context != null){
                factory.initializeAuthHeaders(context);
                factory.initializeBlob(context.userName);
            }
        };

        factory.initializeAuthHeaders = function(context){
            $http.defaults.headers.common['Authorization'] = context.token;
            //$http.defaults.withCredentials = true;
        };

        factory.initializeBlob = function(userName){
            if(blobService.getBlob(userName) == null) {
                var userBlob = blobService.getBlobTemplate();
                blobService.saveBlob(userName, userBlob);
            }
        };

        //TODO: clean up $rootScope listeners
        factory.setupListener = function() {
            $rootScope.$on('loginEvent', function (event, args) {
                //factory.start(args.key);
            });

            $rootScope.$on('logoutEvent', function (event, args) {
                $location.path('/');
            });

            //$rootScope.$on('registrationEvent', function (event, args) {
            //    contextService.createContext({userName : args.userName, cryptoKey : args.key});
            //
            //    // automatic login when registered
            //    $rootScope.$broadcast('loginEvent', {userName: args.userName});
            //
            //    //$location.path('/');
            //
            //});
        };

        return factory;
    };

    initializationFactory.$inject = injectParams;

    angular.module('id-io').value('config', configValue);
    angular.module('id-io').factory('initializationService', initializationFactory);

}());