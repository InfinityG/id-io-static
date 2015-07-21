(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', 'userService'];

    var HeaderController = function ($scope, $rootScope, $location, $routeParams, userService) {

        $scope.userName = null;

        function init(){
            loadUserName();
        }

        $scope.logout = function(){
            userService.logout();
            $scope.userName = null;

            $rootScope.$broadcast('logoutEvent');
        };

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            loadUserName();
        });

        //clean up rootScope listener
        $scope.$on('$destroy', function() {
            loginEventListener();
        });

        function loadUserName(){
            var context = userService.getContext();
            $scope.userName = context == null ? null : context.userName;
        }

        init();
    };

    HeaderController.$inject = injectParams;

    angular.module('id-io').controller('HeaderController', HeaderController);

}());