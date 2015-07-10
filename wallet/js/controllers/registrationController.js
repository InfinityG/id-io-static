(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'userService', 'localStorageService', 'registrationService'];

    var RegistrationController = function ($scope, $location, $routeParams, $window, userService, localStorageService, registrationService) {

        $scope.firstName = null;
        $scope.lastName = null;
        $scope.userName = null;
        $scope.password = null;
        $scope.context = null;
        $scope.publicKey = null;
        $scope.secretKey = null;

        var keys = null;

        function init() {

            // redirect if the user is already logged in
            if(userService.getContext() != null)
                $location.path('/');

            //generate new keys
            keys = registrationService.generateKeys();
            $scope.secretKey = keys.sk.toString('base64');
            $scope.publicKey = keys.pk.toString('base64');
        }

        $scope.register = function () {
            registrationService.register($scope.firstName, $scope.lastName, $scope.userName,
                $scope.password, keys.pk, keys.sk);
        };

        init();
    };

    RegistrationController.$inject = injectParams;

    angular.module('id-io').controller('RegistrationController', RegistrationController);

}());