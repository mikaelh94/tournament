angular.module('tournamentApp.tournamentModule')

  .controller('TournamentCtrl', [
    '$scope',
    '$rootScope',
    '$stateParams',
    '$filter',
    'tournamentService',
    'tournamentGenerate',
    'tournament',
    function($scope, $rootScope, $stateParams, $filter, tournamentService, tournamentGenerate, tournament){
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
            $scope.isActive = ($scope.t.status === 'running');
          }
        );
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