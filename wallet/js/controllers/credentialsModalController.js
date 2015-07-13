(function () {

    var injectParams = ['$scope', '$rootScope', 'userService', 'keyService'];

    var CredentialsModalController = function ($scope, $rootScope, userService, keyService) {
        $scope.show = false;
        $scope.passwordError = false;
        $scope.credentials = {password: null};

        $scope.cancelModal = function () {
            hideModal();
        };

        var credentialsEventListener = $rootScope.$on('enterCredentialsEvent', function (event, args) {
            showModal();
        });

        $scope.credentialsEntered = function () {
            if (validate()) {

                $rootScope.$broadcast('credentialsEnteredEvent', {
                    credentials: $scope.credentials
                });

                hideModal();
            } else {
                $scope.passwordError = true;
            }
        };

        function validate() {
            $scope.passwordError = false;
            var context = userService.getContext();
            return keyService.validateCredentials(context.userName, $scope.credentials.password);
        }

        //clean up rootScope listeners
        $scope.$on('$destroy', function () {
            credentialsEventListener();
        });

        function hideModal() {
            $scope.show = false;
            $scope.credentials = {password: null};
            $scope.passwordError = false;
        }

        function showModal() {
            $scope.show = true;
        }
    };

    CredentialsModalController.$inject = injectParams;

    angular.module('id-io').controller('CredentialsModalController', CredentialsModalController);

}());