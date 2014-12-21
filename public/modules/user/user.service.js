angular.module('tournamentApp.userModule')

    .factory('userService',[
        '$resource',
        '$state',
        '$rootScope',
        function($resource, $state, $rootScope){
            return {

                register: function(data) {
                    var self = this;

                    return $resource('/auth/register').save(data, function(response) {
                        self.setCurrentUser(response);
                        $state.go('home');
                    });
                },

                login: function(data) {
                    return $resource('/auth/login').save(data, function(response) {
                        console.log(response);
                    });
                },

                logout: function() {
                    return $resource('/auth/logout').get(function(response) {
                        $rootScope.isLogged = false;
                        $rootScope.currentUser = null;
                        $state.go('home');
                    });
                },

                setCurrentUser: function(user) {
                    $rootScope.isLogged = false;
                    $rootScope.currentUser = null;

                    if (user && typeof user._id !== 'undefined'
                             && typeof user.username !== 'undefined'
                             && typeof user.email !== 'undefined') {

                        $rootScope.currentUser = {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        };
                        $rootScope.isLogged = true;
                    }
                },

                getCurrentUser: function() {
                    var self = this;

                    return $resource('/auth/user').get(function(response) {
                        self.setCurrentUser(response);
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