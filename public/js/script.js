var tournamentModule = angular.module('tournamentApp', [
    'ui.router',
    'ngResource',
    'ngMessages',
    'tournamentApp.commonModule',
    'tournamentApp.tournamentModule',
    'tournamentApp.userModule'
])


    /**
     *  App config:
     *  - routes
     */
    .config([
        '$stateProvider', 
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/modules/common/home/home.view.html',
                    controller: 'HomeCtrl'
                })

                // tournaments
                .state('tournament', {
                    url: '/tournament/{id:int}',
                    templateUrl: '/modules/tournament/tournament.view.html',
                    controller: 'TournamentCtrl'
                })
                .state('tournamentCreate', {
                    url: '/tournament/create',
                    templateUrl: '/modules/tournament/tournament-create.view.html',
                    controller: 'TournamentCreateCtrl'
                })

                // users
                .state('userRegister', {
                    url: '/user/register',
                    templateUrl: '/modules/user/user-register.view.html',
                    controller: 'UserRegisterCtrl'
                })
            ;

            $urlRouterProvider.otherwise('home');
        }
    ])

;
angular.module('tournamentApp.commonModule', [])

;
angular.module('tournamentApp.tournamentModule', []);
angular.module('tournamentApp.userModule', []);
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
angular.module('tournamentApp.commonModule')

    .controller('HomeCtrl', [
        '$scope',
        'tournamentServices',
        function($scope, tournamentServices){
            $scope.tournaments = tournamentServices.query(function() {
                console.log('tournaments list loaded');
            });
        }
    ])

;
angular.module('tournamentApp.tournamentModule')

    .controller('TournamentCtrl', [
        '$scope',
        'tournamentServices',
        function($scope, tournamentServices){

        }
    ])


    .controller('TournamentCreateCtrl', [
        '$scope',
        'tournamentAdd',
        function($scope, tournamentAdd){

            // $scope.newTournament = new tournamentAdd();

            $scope.createTournament = function() {

                $scope.$broadcast('show-errors-check-validity');

                if ($scope.newTournamentForm.$invalid) { return; }

                // $scope.newTournament.$save(function() {
                //   console.log('success');
                // });
                tournamentAdd($scope.newTournament);
            };
        }
    ])

;
angular.module('tournamentApp.tournamentModule')

    
;
angular.module('tournamentApp.tournamentModule')

    .factory('tournamentServices',[
        '$resource',
        function($resource){
            return $resource('/tournaments/:id');
        }
    ])

    .factory('tournamentAdd',[
        '$resource',
        function($resource){
            return function(data) {
                $resource('/tournaments').save(data);
            };
        }
    ])

;
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
                if ($scope.newUserForm.$invalid) { return; }

                userService.register($scope.newUser);
            };
        }
    ])

;
angular.module('tournamentApp.userModule')



;
angular.module('tournamentApp.userModule')

    .factory('userService',[
        '$resource',
        '$state',
        '$rootScope',
        function($resource, $state, $rootScope){
            return {

                register: function(data) {
                    var self = this;

                    return $resource('/auth/register').save(data, function(response) {
                        self.setCurrentUser(response);
                        $state.go('home');
                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                },

                logout: function() {
                    return $resource('/auth/logout').get(function(response) {
                        $rootScope.isLogged = false;
                        $rootScope.currentUser = null;
                        $state.go('home');
                    });
                },

                setCurrentUser: function(user) {
                    $rootScope.isLogged = false;
                    $rootScope.currentUser = null;

                    if (user && typeof user._id !== 'undefined'
                             && typeof user.username !== 'undefined'
                             && typeof user.email !== 'undefined') {

                        $rootScope.currentUser = {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        };
                        $rootScope.isLogged = true;
                    }
                },

                getCurrentUser: function() {
                    var self = this;

                    return $resource('/auth/user').get(function(response) {
                        self.setCurrentUser(response);
                    });
                }
            };
        }
    ])

    .factory('userInfo',[
        '$resource',
        function($resource){
            
            return function(user){

                /*var userObj = {};

                register: function(data) {
                    return $resource('/auth/register').save(data, function(response) {
                        console.log(response);
                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                }*/
            };
        }
    ])

;