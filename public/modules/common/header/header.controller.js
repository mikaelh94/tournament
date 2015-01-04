angular.module('tournamentApp.commonModule')

    .controller('HeaderCtrl', [
        '$scope',
        '$rootScope',
        'authService',
        function($scope, $rootScope, authService){

            authService.getCurrentUser();
        }
    ])

;