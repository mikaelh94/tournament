angular.module('tournamentApp.commonModule', [])

  .config([
    '$stateProvider', 
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('home', {
          url: '/home',
          templateUrl: '/modules/common/home/home.view.html',
          controller: 'HomeCtrl'
        })
        
      ;
      $urlRouterProvider.otherwise('home');
    }
  ])

;
angular.module('tournamentApp.tournamentModule', [])

  .config([
    '$stateProvider', 
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('tournamentCreate', {
          url: '/tournament/create',
          templateUrl: '/modules/tournament/tournament-create.view.html',
          controller: 'TournamentCreateCtrl'
        })
        .state('tournament', {
          url: '/tournament/:id',
          templateUrl: '/modules/tournament/tournament.view.html',
          controller: 'TournamentCtrl',
          resolve: {
            tournament: function(tournamentService, $stateParams) {
              return tournamentService.get({id: $stateParams.id}).$promise;
            }
          }
        })
      ;
    }
  ])

;
angular.module('tournamentApp.userModule', [])

  .config([
    '$stateProvider', 
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider

        .state('userList', {
          url: '/user/list',
          templateUrl: '/modules/user/user-list.view.html',
          controller: 'UserListCtrl',
          resolve: {
            userList: function(userService) {
              return userService.getAll().$promise;
            }
          }
        })

        .state('userRegister', {
          url: '/user/register',
          templateUrl: '/modules/user/user-register.view.html',
          controller: 'UserRegisterCtrl'
        })

        .state('userProfile', {
          url: '/user/:id',
          templateUrl: '/modules/user/user-profile.view.html',
          controller: 'UserProfileCtrl'
        })

      ;
    }
  ])

;
var tournamentModule = angular.module('tournamentApp', [
  'ui.router',
  'ngResource',
  'ngMessages',
  'tournamentApp.commonModule',
  'tournamentApp.tournamentModule',
  'tournamentApp.userModule'
])

;
angular.module('tournamentApp.commonModule')

    .controller('HeaderCtrl', [
        '$scope',
        '$rootScope',
        'authService',
        function($scope, $rootScope, authService){

            authService.getCurrentUser();
        }
    ])

;
angular.module('tournamentApp.commonModule')


  .directive('tournamentHeader', [
    function() {
      return {
        restrict: 'EA',
        templateUrl: '/modules/common/header/header.partial.html',
        replace: true,
        link: function (scope, el, attrs) {

        }
      };
    }
  ])

  .directive('headerLoginForm', [
    'authService',
    '$timeout',
    function(authService, $timeout) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/common/header/header-login-form.partial.html',
        replace: true,
        link: function (scope, el, attrs) {

          scope.focusLogin = function() {
            $timeout(function() {
              document.getElementById('userLoginUsername').focus();
            });
          };

          scope.login = function() {

            if (scope.userLoginForm.$invalid) { return; }

            authService.login(scope.userLogin)
              .$promise.then(
                function(response) {
                  if (!response.user && response.info) {
                    scope.loginError = response.info;
                  }
                }
              );

          };
          
        }
      };
    }
  ])



  .directive('headerUserInfo', [
    'authService',
    function(authService) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/common/header/header-user-info.partial.html',
        replace: true,
        link: function (scope, el, attrs) {
          scope.logout = function() {
            authService.logout();
          };
        }
      };
    }
  ])

;
angular.module('tournamentApp.commonModule')

    .controller('HomeCtrl', [
        '$scope',
        'tournamentService',
        function($scope, tournamentService){
            $scope.tournaments = tournamentService.getAll();
        }
    ])

;
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
angular.module('tournamentApp.tournamentModule')

  .directive('tournamentDiagram', [
    'tournamentService',
    '$stateParams',
    function(tournamentService, $stateParams) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/tournament/tournament-diagram.partial.html',
        replace: true,
        link: function (scope, el, attrs) {
          // scope.tournament = tournamentService.get({ id: $stateParams.id });

          // console.log(scope.rounds);

          scope.rounds = scope.t.rounds;
        }
      };
    }
  ])

;
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
        removePlayer: { method: 'DELETE', params: { playerId: '@playerId' } }
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

          if ( !isPowerOfTwo(playersLength) ) {
            console.log('Players count must be a power of two (2, 4, 8, 16, 32, etc...');
            return;
          }

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

          // check if players count is 2, 4, 8 , 16, 32, etc...
          function isPowerOfTwo(x) {
            return (x != 0) && ((x & (x - 1)) == 0);
          };

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
angular.module('tournamentApp.userModule')

    .controller('UserListCtrl', [
        '$scope',
        'userList',
        function($scope, userList){

            $scope.users = userList;

        }
    ])

    .controller('UserProfileCtrl', [
        '$scope',
        '$rootScope',
        '$stateParams',
        'userService',
        function($scope, $rootScope, $stateParams, userService){

            $scope.user = userService.get({id: $stateParams.id});

        }
    ])

    .controller('UserRegisterCtrl', [
        '$scope',
        'authService',
        function($scope, authService){

            $scope.createUser = function() {
                if ($scope.newUserForm.$invalid) { return; }

                authService.register($scope.newUser)
                    .$promise.then(
                        function(response) {
                            if (!response.user && response.info) {
                                $scope.registerError = response.info;
                            }
                        }
                    );
            };
        }
    ])

;
angular.module('tournamentApp.userModule')



;
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