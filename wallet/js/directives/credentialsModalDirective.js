//Used for form validation
(function () {
    var credentialsModal = function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'CredentialsModalController',
            templateUrl: 'credentials.html'
        };
    };

    angular.module('id-io').directive('credentialsModal', credentialsModal);
})();