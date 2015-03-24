angular.module('tournamentApp.tournamentModule')

  .factory('tournamentService',[
    '$resource',
    '$state',
    function($resource, $state){
      return $resource('/tournaments/:id/:playerId', { id:'@id' }, {
        getAll: { method: 'GET', isArray: true },
        create: { method: 'POST' },
        start: { method: 'PUT', data: { rounds: '@rounds' } },
        addPlayer: { method: 'POST', params: { playerId: '@playerId' } },
        removePlayer: { method: 'DELETE', params: { playerId: '@playerId' } },
        reset: { method: 'PUT', params: { reset: '@reset' } },
        setScores: { method: 'PUT', params: { scores: '@scores' } }
      });

    }
  ])

  /**
   *  Calculate points for users after a game
   *  based on FFTT rules ( http://www.fftt.com/sportif/pclassement/html/grille.htm )
   */
  .factory('tournamentCalculatePoints',[
    function(){
      return function(player1, player2, winner, totalRounds, currentRound) {
        var normalWin  = [  6,  5.5,  5,  4,   3,     2,    1, 0.5,   0],
            extraWin   = [  6,    7,  8, 10,  13,    17,   22,  28,  40],
            normalLose = [ -5, -4.5, -4, -3,  -2,    -1, -0.5,   0,   0],
            extraLose  = [ -5,   -6, -7, -8, -10, -12.5,  -16, -20, -29],
            ranges = [
              [0, 24], [25, 49], [50, 99], [100, 149], [150, 199], [200, 299], [300, 399], [400, 499], [500, 1000000]
            ],
            diff = Math.abs(player1.points - player2.points),
            rangeIndex,
            pts1 = 0,
            pts2 = 0;

        for (var i = 0, len = ranges.length; i < len; i++) {
          if ( diff >= ranges[i][0] && diff <= ranges[i][1] ) {
            rangeIndex = i;
            break;
          }
        };
        

        if (player1.points > player2.points) {
          if (winner === 1) {
            pts1 = player1.points + normalWin[rangeIndex];
            pts2 = player2.points + normalLose[rangeIndex];
          } else {
            pts1 = player1.points + extraLose[rangeIndex];
            pts2 = player2.points + extraWin[rangeIndex];
          }
        } else {
          if (winner === 1) {
            pts1 = player1.points + extraWin[rangeIndex];
            pts2 = player2.points + extraLose[rangeIndex];
          } else {
            pts1 = player1.points + normalLose[rangeIndex];
            pts2 = player2.points + normalWin[rangeIndex];
          }
        }

        return [pts1, pts2];
      };
    }
  ])

  // tournament generation of matchs/rounds/pools 
  .factory('tournamentGenerate',[
    'tournamentService',
    '$filter',
    function(tournamentService, $filter){
      return {
        knockOut: function(tournamentId, players) {
          var playersLength = players.length;

          var sortedPlayers = players.sort(compare),
              roundsLength = Math.log(playersLength)/Math.log(2),
              rounds = [],
              gameCount = 1,
              gamePerRound = 1,
              playersPositions = [1, 2];


          /**
           *  rounds array contructions
           *  0 = final, 1 = semi finals, etc...
           *********************************************/
          for (var round = 0; round < roundsLength; round++) {

            // store players positions
            if (round > 0) {
              playersPositions = seeding(playersPositions);
            }

            // set rounds
            var roundItem = {
              round: round,
              games: games(round)
            }

            gamePerRound = gamePerRound * 2;
            rounds.push(roundItem);
          };

          // send data
          return tournamentService.start({id: tournamentId, rounds: rounds }).$promise;

          /**
           *  game construction in each rounds
           *********************************************/
          function games(round) {
            var game = [],
                positionCount = 0;

            for (var i = 0; i < gamePerRound ; i++) {
              var gameItem = {
                id: gameCount,
                nextGame:  ( round > 0 ) ? parseInt(gameCount/2, 10) : null
              }

              // set players start position
              if (round === roundsLength-1) {
                gameItem.player1 = sortedPlayers[ playersPositions[positionCount++] -1 ]._id;
                gameItem.player2 = sortedPlayers[ playersPositions[positionCount++] -1 ]._id;
              }

              gameCount ++;
              game.push(gameItem);
            };

            return game;
          };


          // define players start position by their points
          function seeding(pls){
            var out=[];
            var length = pls.length*2+1;
            pls.forEach(function(d){
              out.push(d);
              out.push(length-d);
            });
            return out;
          }

          // sort by points
          function compare(a,b) {
            if (a.points < b.points)
              return 1;
            if (a.points > b.points)
              return -1;
            return 0;
          };

        }
      };

    }
  ])

;