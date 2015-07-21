(function () {

    var injectParams = ['$rootScope', '$scope', '$location', '$routeParams', '$window', 'config', 'userService', 'walletService'];

    var LoginController = function ($rootScope, $scope, $location, $routeParams, $window, config, userService, walletService) {

        $scope.currentWallet = null;
        $scope.currentKeyPair = null;
        $scope.publicKey = null;
        $scope.secretKey = null;
        $scope.cryptoKey = null;

        $scope.userValidated = false;
        $scope.passwordValidated = false;
        $scope.userName = null;
        $scope.password = null;
        $scope.domain = null;

        $scope.domainAliases = config.domainAliases;

        function init(){
            // redirect if the user is already logged in
            if(userService.getContext() != null)
                $location.path('/');

            if($routeParams.exit != null)
                $scope.deleteToken();
            else
                $scope.context = userService.getContext();
        }

        $scope.login = function () {
            var wallet = walletService.getWallet($scope.userName);

            if (wallet != null) {
                $scope.currentWallet = wallet;
                $scope.currentKeyPair = wallet.keys;
                $scope.publicKey = wallet.keys.pk;
                $scope.secretKey = wallet.keys.sk;

                userService.login($scope.userName, $scope.password, $scope.domain);
            }else{
                // invoke modal
                $rootScope.$broadcast('modalEvent', {
                    type: 'Error',
                    message: "User cannot be found. Do you need to restore your wallet?",
                    redirect : true,
                    redirectUrl : '/login'
                });
            }
        };

        $scope.domainSelected = function(value){
            $scope.domain = value;
        };

        $scope.deleteToken = function () {
            userService.deleteToken();
        };

        $scope.goRegister = function () {
            $location.path('/register');
        };

        //function loadUserWallet(userName) {
        //    var wallet = userService.getWallet(userName);
        //
        //    if (wallet != null) {
        //        $scope.userName = userName;
        //        $scope.currentWallet = wallet;
        //        $scope.currentKeyPair = wallet.keys;
        //        $scope.publicKey = wallet.keys.pk;
        //        $scope.secretKey = wallet.keys.sk;
        //    }
        //}

        init();
    };

    LoginController.$inject = injectParams;

    angular.module('id-io').controller('LoginController', LoginController);

}());