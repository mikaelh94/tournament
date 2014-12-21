angular.module('tournamentApp.userModule')


    .directive('loginForm', [
        'userService',
        function(userService) {
            return {
                restrict: 'EAC',
                templateUrl: '/modules/user/user-login.partial.html',
                link: function (scope, el, attrs) {
                    scope.login = function() {

                        var user = {
                            username: 'toto',
                            password: 'tata'
                        }

                        userService.login(user);

                    };

                    //scope.currentUser = $root.currentUser;
                }
            };
        }
    ])

;