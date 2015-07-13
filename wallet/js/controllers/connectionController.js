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

            refreshConnections();
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
            connectionService.createConnection($scope.connectionUserName, password);
            refreshConnections();
        }

        function confirm(password) {
            connectionService.confirmConnection($scope.connectionId, password);
            refreshConnections();
        }

        function disconnect(password) {
            console.debug('Disconnect not implemented!');
        }

        function reject(password) {
            console.debug('Reject not implemented!');
        }

        function refreshConnections(){
            $scope.connections = connectionService.getConnections();
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