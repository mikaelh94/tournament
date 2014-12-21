angular.module('tournamentApp.userModule')

    .controller('UserCtrl', [
        '$scope',
        function($scope){

        }
    ])


    .controller('UserRegisterCtrl', [
        '$scope',
        'userService',
        function($scope, userService){

            $scope.createUser = function() {

                $scope.$broadcast('show-errors-check-validity');
                $scope.showMessages = true;

                if ($scope.newUserForm.$invalid) { return; }

                userService.register($scope.newUser);
            };
        }
    ])

;