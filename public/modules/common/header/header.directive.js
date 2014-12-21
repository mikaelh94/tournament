angular.module('tournamentApp.commonModule')


    .directive('tournamentHeader', [
        function() {
            return {
                restrict: 'EA',
                templateUrl: '/modules/common/header/header.partial.html',
                replace: true,
                link: function (scope, el, attrs) {

                }
            };
        }
    ])

    .directive('headerLoginForm', [
        'userService',
        function(userService) {
            return {
                restrict: 'EA',
                templateUrl: '/modules/common/header/header-login-form.partial.html',
                replace: true,
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



    .directive('headerUserInfo', [
        'userService',
        function(userService) {
            return {
                restrict: 'EA',
                templateUrl: '/modules/common/header/header-user-info.partial.html',
                replace: true,
                link: function (scope, el, attrs) {
                    scope.logout = function() {
                        userService.logout();
                    };
                }
            };
        }
    ])

;