(function () {

    var injectParams = ['$scope', '$location', 'contextService'];

    var DefaultController = function ($scope, $location, contextService) {

        $scope.context = null;

        function init(){
            $scope.context = contextService.getContext();
        }

        $scope.goRegister = function(){
            $location.path('/register')
        };

        init();
    };

    DefaultController.$inject = injectParams;

    angular.module('id-io').controller('DefaultController', DefaultController);

}());