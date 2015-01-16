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