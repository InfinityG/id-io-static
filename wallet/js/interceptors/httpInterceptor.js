/**
 * Created by grant on 26/01/2015.
 */
/* based on pattern from: http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html */

(function () {

    var injectParams = ['$q', '$window', '$location', '$rootScope'];

    var httpInterceptor = function ($q, $window, $location, $rootScope) {

        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {
                switch (rejection.status) {
                    case 401:   //unauthorized
                        // invoke modal
                        $rootScope.$broadcast('modalEvent', {
                            type: 'Unauthorized access',
                            //message: rejection.data,
                            message: 'Access denied - please ensure your credentials are correct',
                            status: rejection.status,
                            redirect : true,
                            redirectUrl : '/login'
                        });
                        break;
                    case 0: // no connection
                        // invoke modal
                        $rootScope.$broadcast('modalEvent', {
                            type: 'Error',
                            message: 'No connection',
                            status: rejection.status,
                            redirect : true,
                            redirectUrl : '/login'
                        });
                        break;
                    default :   // 500 errors
                        // invoke modal
                        $rootScope.$broadcast('modalEvent', {
                            type: 'Error',
                            message: rejection.data,
                            status: rejection.status,
                            redirect : false,
                            redirectUrl : null
                        });
                        break;
                }

                return $q.reject(rejection);
            }
        };
    };

    httpInterceptor.$inject = injectParams;

    angular.module('id-io').factory('httpInterceptor', httpInterceptor);

}());