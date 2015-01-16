angular.module('tournamentApp.tournamentModule')

  .directive('tournamentDiagram', [
    'tournamentService',
    '$stateParams',
    '$modal',
    function(tournamentService, $stateParams, $modal) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/tournament/tournament-diagram.partial.html',
        replace: true,
        link: function (scope, el, attrs) {

          scope.displayScores = function(totalScores) {
            var player1Score = [],
                player2Score = [];

            for (var i = 0; i < totalScores.length; i++) {
              singleScore = totalScores[i].split(':');
              singleScore1 = { score: singleScore[0], isWinner: (singleScore[0] > singleScore[1]) };
              singleScore2 = { score: singleScore[1], isWinner: (singleScore[1] > singleScore[0]) };

              player1Score.push(singleScore1);
              player2Score.push(singleScore1);
            };

            return {
              player1: player1Score,
              player2: player2Score
            }
          };

          scope.scorePopin = function(tournamentId, roundId, game, matchToWin) {
            
            if (game.scores.length === 0 && game.player1 && game.player2) {

              var popin = $modal.open({
                templateUrl: '/modules/tournament/tournament-score.modal.html',
                controller: 'TournamentScorePopinCtrl',
                size: 'sm',
                windowClass: 'score-popin',
                resolve: {
                  tournamentId: function() {return tournamentId;},
                  currentRoundId: function() {return roundId;},
                  currentGame: function() {return game;},
                  matchToWin: function() {return matchToWin;}
                }
              });


              popin.result.then(function(data) {
                scope.t = data;
              });

            }

          };
        }
      };
    }
  ])

;