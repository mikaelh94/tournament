angular.module('tournamentApp.tournamentModule')

    .factory('tournamentServices',[
        '$resource',
        function($resource){
            return $resource('/tournaments/:id');
        }
    ])

    .factory('tournamentAdd',[
        '$resource',
        function($resource){
            return function(data) {
                $resource('/tournaments').save(data);
            };
        }
    ])

;