(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'userService', 'localStorageService', 'connectionService'];

    var ConnectionController = function ($scope, $rootScope, $location, $routeParams, $window, userService, localStorageService, connectionService) {

        $scope.connections = null;
        $scope.connectionUserName = null;
        $scope.action = null;
        $scope.connectionId = null;

        function init(){
            if(userService.getContext() == null)
                $location.path('/login');

            $scope.connections = connectionService.getConnections();
        }

        var credentialsEnteredEventListener = $rootScope.$on('credentialsEnteredEvent', function (event, args) {
            credentialsEntered(args.credentials);
        });

        $scope.setAction = function(connectionId, action){
            $scope.connectionId = connectionId;
            $scope.action = action;

            //now invoke the credentials modal
            $rootScope.$broadcast('enterCredentialsEvent', {});
        };

        function credentialsEntered(credentials){
            switch($scope.action){
                case 'connect':
                    connect(credentials.password);
                    break;
                case 'confirm':
                    confirm(credentials.password);
                    break;
                case 'disconnect':
                    disconnect(credentials.password);
                    break;
                case 'reject':
                    reject(credentials.password);
                    break;
                default:
            }
        }

        function connect(password) {
            connectionService.createConnection($scope.connectionUserName, password, refreshConnections);
        }

        function confirm(password) {
            connectionService.updateConnection($scope.connectionId, 'connected', password, refreshConnections);
        }

        function disconnect(password) {
            connectionService.updateConnection($scope.connectionId, 'disconnected', password, refreshConnections);
        }

        function reject(password) {
            connectionService.updateConnection($scope.connectionId, 'rejected', password, refreshConnections);
        }

        function refreshConnections(){
            $scope.connections = connectionService.getConnections();
            $scope.connectionUserName = null;
            $scope.action = null;
            $scope.connectionId = null;

            $scope.connectionForm.$setPristine();
        }

        //clean up rootScope listeners
        $scope.$on('$destroy', function() {
            credentialsEnteredEventListener();
        });

        init();
    };

    ConnectionController.$inject = injectParams;

    angular.module('id-io').controller('ConnectionController', ConnectionController);

}());