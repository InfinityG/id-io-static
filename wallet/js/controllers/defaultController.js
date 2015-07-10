(function () {

    var injectParams = ['$scope', '$location', 'userService'];

    var DefaultController = function ($scope, $location, userService) {

        $scope.context = null;

        function init(){
            $scope.context = userService.getContext();
        }

        $scope.goLogin = function(){
            $location.path('/login')
        };

        $scope.goRegister = function(){
            $location.path('/register')
        };

        init();
    };

    DefaultController.$inject = injectParams;

    angular.module('id-io').controller('DefaultController', DefaultController);

}());