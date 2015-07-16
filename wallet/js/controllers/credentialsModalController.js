(function () {

    var injectParams = ['$scope', '$rootScope', 'userService', 'keyService'];

    var CredentialsModalController = function ($scope, $rootScope, userService, keyService) {
        $scope.show = false;
        $scope.passwordError = false;
        $scope.credentials = {password: null};

        $scope.cancelModal = function () {
            $scope.hideModal();
        };

        var credentialsEventListener = $rootScope.$on('enterCredentialsEvent', function (event, args) {
            $scope.showModal();
        });

        $scope.credentialsEntered = function () {
            if ($scope.validate()) {

                $rootScope.$broadcast('credentialsEnteredEvent', {
                    credentials: $scope.credentials
                });

                $scope.hideModal();
            } else {
                $scope.passwordError = true;
            }
        };

        $scope.validate = function() {
            $scope.passwordError = false;
            var context = userService.getContext();
            return keyService.validateCredentials(context.userName, $scope.credentials.password);
        };

        //clean up rootScope listeners
        $scope.$on('$destroy', function () {
            credentialsEventListener();
        });

        $scope.hideModal = function() {
            $scope.show = false;
            $scope.credentials = {password: null};
            $scope.passwordError = false;
        };

        $scope.showModal = function() {
            $scope.show = true;
        }
    };

    CredentialsModalController.$inject = injectParams;

    angular.module('id-io').controller('CredentialsModalController', CredentialsModalController);

}());