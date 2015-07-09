(function () {
    var app = angular.module('id-io', ['ngRoute', 'mobile-angular-ui']);

    app.config(function ($routeProvider, $httpProvider) {

        //authentication interceptor (http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html)
        $httpProvider.interceptors.push('httpInterceptor');

        $routeProvider
            .when('/wallet', {
                controller: 'WalletController',
                templateUrl: 'wallet.html',
                reloadOnSearch: false
            })
             .when('/sso', {
                //controller: 'LoginController',
                templateUrl: 'sso.html',
                reloadOnSearch: false
            })
            .when('/register', {
                controller: 'RegistrationController',
                templateUrl: 'register.html',
                reloadOnSearch: false
            })
            .when('/connections', {
                controller: 'ConnectionController',
                templateUrl: 'connections.html',
                reloadOnSearch: false
            })
            .when('/', {
                controller: 'HeaderController',
                templateUrl: 'default.html',
                reloadOnSearch: false
            });
    });

    app.run(function(initializationService){
        initializationService.init();
    });

}());