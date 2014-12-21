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

    .directive('showErrors', function() {
        return {
            restrict: 'A',
            require:  '^form',
            link: function (scope, el, attrs, formCtrl) {
                // find the text box element, which has the 'name' attribute
                var inputEl   = el[0].querySelector("[name]");
                // convert the native text box element to an angular element
                var inputNgEl = angular.element(inputEl);
                // get the name on the text box so we know the property to check
                // on the form controller
                var inputName = inputNgEl.attr('name');

                // only apply the has-error class after the user leaves the text box
                inputNgEl.bind('focus', function() {
                    el.removeClass('has-error');
                });

                scope.$on('show-errors-check-validity', function() {
                    el.toggleClass('has-error', formCtrl[inputName].$invalid);
                });
            }
        };
    })

;
angular.module('tournamentApp.tournamentModule', []);
angular.module('tournamentApp.userModule', []);
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

                $scope.$broadcast('show-errors-check-validity');
                $scope.showMessages = true;

                if ($scope.newUserForm.$invalid) { return; }

                userService.register($scope.newUser);
            };
        }
    ])

;
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
angular.module('tournamentApp.userModule')

    .factory('userService',[
        '$resource',
        function($resource){
            // $resource('/users/:id');
            return {

                register: function(data) {
                    return $resource('/auth/register').save(data, function(response) {

                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                },

                getCurrentUser: function(callback) {
                    return $resource('/auth/user').get(function(data) {
                        callback(data);
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