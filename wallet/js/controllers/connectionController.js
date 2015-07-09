(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'localStorageService', 'connectionService'];

    var ConnectionController = function ($scope, $location, $routeParams, $window, localStorageService, connectionService) {

        $scope.connections = null;

        function init(){
            $scope.connections = connectionService.getConnections();
        }

        $scope.confirm = function (connectionId, password) {
            connectionService.confirmConnection(connectionId, password);
        };

        init();
    };

    ConnectionController.$inject = injectParams;

    angular.module('id-io').controller('ConnectionController', ConnectionController);

}());