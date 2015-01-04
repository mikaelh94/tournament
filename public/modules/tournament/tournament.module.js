angular.module('tournamentApp.tournamentModule', [])

  .config([
    '$stateProvider', 
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('tournamentCreate', {
          url: '/tournament/create',
          templateUrl: '/modules/tournament/tournament-create.view.html',
          controller: 'TournamentCreateCtrl'
        })
        .state('tournament', {
          url: '/tournament/:id',
          templateUrl: '/modules/tournament/tournament.view.html',
          controller: 'TournamentCtrl',
          resolve: {
            tournament: function(tournamentService, $stateParams) {
              return tournamentService.get({id: $stateParams.id}).$promise;
            }
          }
        })
      ;
    }
  ])

;