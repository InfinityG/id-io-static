(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'userService', 'localStorageService'];

    var LoginController = function ($scope, $location, $routeParams, $window, userService, localStorageService) {

        $scope.currentWallet = null;
        $scope.currentKeyPair = null;
        $scope.publicKey = null;
        $scope.secretKey = null;
        $scope.cryptoKey = null;

        $scope.userValidated = false;
        $scope.passwordValidated = false;
        $scope.userName = null;
        $scope.password = null;

        function init(){
            // redirect if the user is already logged in
            if(userService.getContext() != null)
                $location.path('/');

            if($routeParams.exit != null)
                $scope.deleteToken();
            else
                $scope.context = userService.getContext();
        }

        $scope.login = function (userName, password) {
            loadUserWallet(userName);
            userService.login(userName, password);
        };

        $scope.deleteToken = function () {
            userService.deleteToken();
        };

        $scope.goRegister = function () {
            $location.path('/register');
        };

        function loadUserWallet(userName) {
            var wallet = localStorageService.getWallet(userName);

            if (wallet != null) {
                $scope.userName = userName;
                $scope.currentWallet = wallet;
                $scope.currentKeyPair = wallet.keys;
                $scope.publicKey = wallet.keys.pk;
                $scope.secretKey = wallet.keys.sk;
            }
        }

        init();
    };

    LoginController.$inject = injectParams;

    angular.module('id-io').controller('LoginController', LoginController);

}());