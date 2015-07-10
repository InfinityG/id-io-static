(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'localStorageService', 'connectionService'];

    var ConnectionController = function ($scope, $location, $routeParams, $window, localStorageService, connectionService) {

        $scope.connections = null;
        $scope.connectionUserName = null;
        $scope.password = null;

        function init(){
            $scope.connections = connectionService.getConnections();
        }

        $scope.connect = function () {
            connectionService.createConnection($scope.connectionUserName, $scope.password);
            $scope.connections = connectionService.getConnections();
        };

        $scope.confirm = function (connectionId) {
            connectionService.confirmConnection(connectionId, $scope.password);
            $scope.connections = connectionService.getConnections();
        };

        init();
    };

    ConnectionController.$inject = injectParams;

    angular.module('id-io').controller('ConnectionController', ConnectionController);

}());