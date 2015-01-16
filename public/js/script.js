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
  'ui.bootstrap',
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
            points = Math.floor((Math.random() * 300) + 1);

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
    '$modalInstance',
    'tournamentId',
    'currentRoundId',
    'currentGame',
    'matchToWin',
    function($scope, tournamentService, $modalInstance, tournamentId, currentRoundId, currentGame, matchToWin){

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
          return;
        }
        $scope.winner = (usr1 > usr2) ? 1 : 2;
      };


      $scope.sendScores = function() {
        if ($scope.scorePopinForm.$invalid || $scope.winner === 0) { return; }

        var winnerId = ($scope.winner === 1) ? currentGame.player1._id : currentGame.player2._id;

        var scoresObj = {
          roundId: currentRoundId,
          gameId: currentGame._id,
          scores: $scope.scores,
          winner: $scope.winner,
          winnerId: winnerId
        };


        tournamentService.setScores({ id: tournamentId, scores: scoresObj }, function(response) {
          $modalInstance.close(response);
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
angular.module('tournamentApp.tournamentModule')

  .directive('tournamentDiagram', [
    'tournamentService',
    '$stateParams',
    '$modal',
    function(tournamentService, $stateParams, $modal) {
      return {
        restrict: 'EA',
        templateUrl: '/modules/tournament/tournament-diagram.partial.html',
        replace: true,
        link: function (scope, el, attrs) {

          scope.displayScores = function(totalScores) {
            var player1Score = [],
                player2Score = [];

            for (var i = 0; i < totalScores.length; i++) {
              singleScore = totalScores[i].split(':');
              singleScore1 = { score: singleScore[0], isWinner: (singleScore[0] > singleScore[1]) };
              singleScore2 = { score: singleScore[1], isWinner: (singleScore[1] > singleScore[0]) };

              player1Score.push(singleScore1);
              player2Score.push(singleScore1);
            };

            return {
              player1: player1Score,
              player2: player2Score
            }
          };

          scope.scorePopin = function(tournamentId, roundId, game, matchToWin) {
            
            if (game.scores.length === 0 && game.player1 && game.player2) {

              var popin = $modal.open({
                templateUrl: '/modules/tournament/tournament-score.modal.html',
                controller: 'TournamentScorePopinCtrl',
                size: 'sm',
                windowClass: 'score-popin',
                resolve: {
                  tournamentId: function() {return tournamentId;},
                  currentRoundId: function() {return roundId;},
                  currentGame: function() {return game;},
                  matchToWin: function() {return matchToWin;}
                }
              });


              popin.result.then(function(data) {
                scope.t = data;
              });

            }

          };
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
        removePlayer: { method: 'DELETE', params: { playerId: '@playerId' } },
        reset: { method: 'PUT', params: { reset: '@reset' } },
        setScores: { method: 'PUT', params: { scores: '@scores' } }
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
                            } else {
                                $state.go('home');
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
        getAll: { method: 'GET', params: {}, isArray: true },
        setPoints: { method: 'PUT', data: {points: '@points'} },
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
                return response.user.$promise;
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