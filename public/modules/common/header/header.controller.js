angular.module('tournamentApp.commonModule')

    .controller('HeaderCtrl', [
        '$scope',
        '$rootScope',
        'userService',
        function($scope, $rootScope, userService){

            userService.getCurrentUser();
        }
    ])

;