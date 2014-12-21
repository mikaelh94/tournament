angular.module('tournamentApp.commonModule')

    .controller('HeaderCtrl', [
        '$scope',
        '$rootScope',
        'userService',
        function($scope, $rootScope, userService){

            userService.getCurrentUser(function(user) {
                $rootScope.currentUser = user;
                $rootScope.isLogged = !!user;
            });
        }
    ])

;