angular.module('tournamentApp.userModule')

    .factory('userService',[
        '$resource',
        function($resource){
            // $resource('/users/:id');
            return {

                register: function(data) {
                    return $resource('/auth/register').save(data, function(response) {

                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                },

                getCurrentUser: function(callback) {
                    return $resource('/auth/user').get(function(data) {
                        callback(data);
                    });
                }
            };
        }
    ])

    .factory('userInfo',[
        '$resource',
        function($resource){
            
            return function(user){

                /*var userObj = {};

                register: function(data) {
                    return $resource('/auth/register').save(data, function(response) {
                        console.log(response);
                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                }*/
            };
        }
    ])

;