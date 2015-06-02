(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', 'contextService'];

    var HeaderController = function ($scope, $rootScope, $location, $routeParams, contextService) {

        $scope.userName = null;

        function init(){
            var context = contextService.getContext();
            $scope.userName = context == null ? null : context.userName;
        }

        $scope.logout = function(){
            contextService.deleteContext();
            $scope.userName = null;

            $rootScope.$broadcast('logoutEvent');
        };

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            $scope.userName = args.userName;
        });

        //clean up rootScope listener
        $scope.$on('$destroy', function() {
            loginEventListener();
        });

        init();
    };

    HeaderController.$inject = injectParams;

    angular.module('id-io').controller('HeaderController', HeaderController);

}());