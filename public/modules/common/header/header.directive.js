angular.module('tournamentApp.commonModule')


    .directive('tournamentHeader', function() {
        return {
            restrict: 'EAC',
            templateUrl: '/modules/common/header/header.partial.html',
            link: function (scope, el, attrs) {

            }
        };
    })

;