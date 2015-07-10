(function () {

    var injectParams = ['$scope', '$rootScope', '$location', '$routeParams', '$window', 'userService'];

    var SideBarController = function ($scope, $rootScope, $location, $routeParams, $window, userService) {

        $scope.context = null;

        function init(){
            $scope.context = userService.getContext();
        }

        var loginEventListener = $rootScope.$on('loginEvent', function (event, args) {
            $scope.context = userService.getContext();
        });

        var logoutEventListener = $rootScope.$on('logoutEvent', function (event, args) {
            $scope.context = null;
        });

        //clean up rootScope listener
        $scope.$on('$destroy', function() {
            loginEventListener();
            logoutEventListener();
        });

        init();
    };

    SideBarController.$inject = injectParams;

    angular.module('id-io').controller('SideBarController', SideBarController);

}());