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