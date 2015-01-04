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