angular.module('tournamentApp.tournamentModule')

  .controller('TournamentCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$filter',
    'tournamentService',
    'tournamentGenerate',
    'tournament',

    'userService',
    'authService',
    function($scope, $rootScope, $stateParams, $filter, tournamentService, tournamentGenerate, tournament, userService, authService){
      $scope.t = tournament;

      $scope.isActive = ($scope.t.status === 'running');

      var UserIsPlayerCheck = function(userId, usersArray) {
        if (!userId || !usersArray || !usersArray.length) return false;

        for (var i=0, l=usersArray.length; i < l; i++) {
          if (usersArray[i]._id === userId) {
            return true;
          }
        };
        return false;
      };

      $rootScope.$watch('currentUser.id', function(userId) {
        $scope.userIsPlayer = UserIsPlayerCheck(userId, $scope.t.players);
      });

      $scope.subscribe = function() {
        tournamentService.addPlayer({ id: tournament._id, playerId: $rootScope.currentUser.id},
          function(response) {
            $scope.t = response;
            $scope.userIsPlayer = UserIsPlayerCheck($rootScope.currentUser.id, response.players);
          }
        );
      };

      $scope.unsubscribe = function() {
        tournamentService.removePlayer({ id: tournament._id, playerId: $rootScope.currentUser.id},
          function(response) {
            $scope.t = response;
            $scope.userIsPlayer = UserIsPlayerCheck($rootScope.currentUser.id, response.players);
          }
        );
      };

      $scope.start = function() {
        tournamentGenerate.knockOut(tournament._id, $scope.t.players).then(
          function(response) {
            $scope.t = response;
            $scope.rounds = $scope.t.rounds;
            $scope.isActive = ($scope.t.status === 'running');
          }
        );
      };

      // check if tournament can start
      $scope.$watch('t.players', function(pls) {
        $scope.canStart = (typeof pls !== 'undefined' && pls.length >= 4 && isPowerOfTwo(pls.length));
      });

      // check if players count is 2, 4, 8 , 16, 32, etc...
      function isPowerOfTwo(x) {
        return (x != 0) && ((x & (x - 1)) == 0);
      };

      $scope.$watch('t.currentRound', function(currentRound) {
        $scope.currentRoundLabel = setCurrentRoundLabel(currentRound);
      });

      var setCurrentRoundLabel = function(currentRound) {
        var label = ''
        switch (currentRound) {
          case 0:
            label = 'no active round';
            break;
          case 1:
            label = 'final';
            break;
          case 2:
            label = 'semi-final';
            break;
          case 3:
            label = 'quarter-final';
            break;
          default:
            label = '1/' + currentRound;
            break;
        }
        return label;
      };




      /**
       *  Dev only
       ********************************************************************************/
      
      $scope.generatePlayer = function() {
        var generateStr = function() {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz";

            for( var i=0; i < 4; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        var username = generateStr(),
            points = Math.floor((Math.random() * 1000) + 1);

        var newUser = {
          username: username,
          email: username+'@'+username+'.fr',
          password: 'ppp'
        }


        authService.register(newUser).$promise.then(function(res) {
          userService.setPoints({id: res.user._id, points: points});

          $scope.players = userService.getAll();
        });
      };

      $scope.players = userService.getAll();

      $scope.subscribeTo = function(id) {
        tournamentService.addPlayer({ id: tournament._id, playerId: id},
          function(response) {
            $scope.t = response;
          }
        );
      };

      $scope.resetTournament = function() {
        tournamentService.reset({ id: tournament._id, reset: true}, function(res) {
          $scope.isActive = false;
          $scope.t = res;
        });
      };

      /********************************************************************************/
    }
  ])

  .controller('TournamentScorePopinCtrl', [
    '$scope',
    'tournamentService',
    'userService',
    'tournamentCalculatePoints',
    '$modalInstance',
    'tournamentId',
    'currentRoundId',
    'currentGame',
    'matchToWin',
    function($scope, tournamentService, userService, tournamentCalculatePoints, $modalInstance, tournamentId, currentRoundId, currentGame, matchToWin){

      $scope.player1 = currentGame.player1;
      $scope.player2 = currentGame.player2;
      $scope.scores = [];
      $scope.onlyNumbers = '/^\d+$/';
      $scope.winner = 0;

      $scope.matchToWin = matchToWin;

      $scope.totalMatchs = function() {
        var length = parseInt(matchToWin);
        return new Array(length);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.checkWinner = function() {
        if ($scope.scorePopinForm.$pristine) {
          $scope.winner = 0;
          return;
        }

        var scores = $scope.scores,
            usr1 = usr2 = 0;

        for (var match in scores) {
            usr1 += ( typeof scores[match].player1 === 'number') ? scores[match].player1 : 0;
            usr2 += ( typeof scores[match].player2 === 'number') ? scores[match].player2 : 0;
        }

        if (usr1 === usr2) {
          $scope.winner = 0;
          $scope.scorePopinForm.$setValidity('nowinner', false);
          return;
        }
        $scope.winner = (usr1 > usr2) ? 1 : 2;
        $scope.scorePopinForm.$setValidity('nowinner', true);
        
      };


      $scope.sendScores = function() {

        if ($scope.scorePopinForm.$invalid) return;

        var winnerId = ($scope.winner === 1) ? currentGame.player1._id : currentGame.player2._id;
        var points = tournamentCalculatePoints($scope.player1, $scope.player2, $scope.winner);

        var scoresObj = {
          roundId: currentRoundId,
          gameId: currentGame._id,
          scores: $scope.scores,
          winner: $scope.winner,
          winnerId: winnerId,
          points: points
        };

        userService.setPoints({id: $scope.player1._id, points: points[0] }, function() {
          userService.setPoints({id: $scope.player2._id, points: points[1] }, function() {
            tournamentService.setScores({ id: tournamentId, scores: scoresObj }, function(response) {
              $modalInstance.close(response);
            });
          });
        });


        

      };
    }
  ])


  .controller('TournamentCreateCtrl', [
    '$scope',
    '$state',
    'tournamentService',
    function($scope, $state, tournamentService){

      $scope.createTournament = function() {

        $scope.$broadcast('show-errors-check-validity');

        if ($scope.newTournamentForm.$invalid) { return; }

        tournamentService.create($scope.newTournament, function(response) {
          if (response._id) {
            $state.go('tournament', {id: response._id});
          }
        });
      };
    }
  ])

;