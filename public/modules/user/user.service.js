angular.module('tournamentApp.userModule')

  .factory('userService', [
    '$resource',
    function($resource) {
      return $resource('/users/:id', { id:'@id' }, {
        getAll: { method: 'GET', params: {}, isArray: true }
      });
    }
  ])

  .factory('authService',[
    '$resource',
    '$state',
    '$rootScope',
    function($resource, $state, $rootScope){
      return {

        register: function(data) {
          var self = this;

          return $resource('/auth/register').save(data, 
            function(response) {
              if (response.user) {
                self.setCurrentUser(response.user);
                $state.go('home');
              }
            }
          );
        },

        login: function(data) {
          var self = this;

          return $resource('/auth/login').save(data,
            function(response) {
              if (response.user) {
                self.setCurrentUser(response.user);
              }
            }
          );
        },

        logout: function() {
          return $resource('/auth/logout').get(function(response) {
            $rootScope.isLogged = false;
            $rootScope.currentUser = null;
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

;