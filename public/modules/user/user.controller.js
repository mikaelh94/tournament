angular.module('tournamentApp.userModule')

    .controller('UserListCtrl', [
        '$scope',
        'userList',
        function($scope, userList){

            $scope.users = userList;

        }
    ])

    .controller('UserProfileCtrl', [
        '$scope',
        '$rootScope',
        '$stateParams',
        'userService',
        function($scope, $rootScope, $stateParams, userService){

            $scope.user = userService.get({id: $stateParams.id});

        }
    ])

    .controller('UserRegisterCtrl', [
        '$scope',
        'authService',
        function($scope, authService){

            $scope.createUser = function() {
                if ($scope.newUserForm.$invalid) { return; }

                authService.register($scope.newUser)
                    .$promise.then(
                        function(response) {
                            if (!response.user && response.info) {
                                $scope.registerError = response.info;
                            }
                        }
                    );
            };
        }
    ])

;