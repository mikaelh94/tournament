angular.module('tournamentApp.commonModule', [])

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
        
      ;
      $urlRouterProvider.otherwise('home');
    }
  ])

;