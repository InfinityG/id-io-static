(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'localStorageService', 'connectionService'];

    var ConnectionController = function ($scope, $location, $routeParams, $window, localStorageService, connectionService) {

        $scope.connections = null;
        $scope.connectionUserName = null;
        $scope.connectionId = null;
        $scope.password = null;

        function init(){
            $scope.connections = connectionService.getConnections();
        }

        $scope.connect = function () {
            connectionService.createConnection($scope.connectionUserName, $scope.password);
        };

        $scope.confirm = function () {
            connectionService.confirmConnection($scope.connectionId, $scope.password);
        };

        init();
    };

    ConnectionController.$inject = injectParams;

    angular.module('id-io').controller('ConnectionController', ConnectionController);

}());