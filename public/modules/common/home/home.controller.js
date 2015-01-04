angular.module('tournamentApp.commonModule')

    .controller('HomeCtrl', [
        '$scope',
        'tournamentService',
        function($scope, tournamentService){
            $scope.tournaments = tournamentService.getAll();
        }
    ])

;