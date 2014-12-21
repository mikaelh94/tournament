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