angular.module('tournamentApp.tournamentModule')

  .directive('tournamentDiagram', [
    'tournamentService',
    '$stateParams',
    function(tournamentService, $stateParams) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/tournament/tournament-diagram.partial.html',
        replace: true,
        link: function (scope, el, attrs) {
          // scope.tournament = tournamentService.get({ id: $stateParams.id });

          // console.log(scope.rounds);

          scope.rounds = scope.t.rounds;
        }
      };
    }
  ])

;