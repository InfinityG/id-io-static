(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'localStorageService', 'registrationService'];

    var RegistrationController = function ($scope, $location, $routeParams, $window, localStorageService, registrationService) {

        $scope.userName = null;
        $scope.password = null;
        $scope.context = null;
        $scope.publicKey = null;
        $scope.secretKey = null;

        function init(){
            //generate new keys
            var keys = registrationService.generateKeys();

            $scope.secretKey = keys.sk;
            $scope.publicKey = keys.pk;
        }

        $scope.test = function(){
            alert('OK');
        };

        $scope.register = function (userName, password, publicKey, secretKey) {
            registrationService.register(userName, password, publicKey, secretKey);
        };

        init();
    };

    RegistrationController.$inject = injectParams;

    angular.module('id-io').controller('RegistrationController', RegistrationController);

}());