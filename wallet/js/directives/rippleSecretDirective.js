//Used for form validation
(function () {
    var rippleSecret = function () {
        var ADDRESS_REGEXP = /^s[a-zA-Z0-9]{27,35}$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (ADDRESS_REGEXP.test(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('rippleSecret', true);
                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('rippleSecret', false);
                        elm.toggleClass('has-error', false);    //change the style on the element to use Bootstrap error style
                        return undefined;
                    }
                });
            }
        };
    };

    angular.module('id-io').directive('rippleSecret', rippleSecret);

}());