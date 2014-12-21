angular.module('tournamentApp.commonModule')

    .controller('HomeCtrl', [
        '$scope',
        'tournamentServices',
        function($scope, tournamentServices){
            $scope.tournaments = tournamentServices.query(function() {
                console.log('tournaments list loaded');
            });
        }
    ])

;