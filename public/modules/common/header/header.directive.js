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