angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'ngMaterial'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        controller: 'ChatCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'partials/chat.html'
      })
      .state('connect', {
          url: '/connect',
          controller: 'ConnectCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'partials/connect.html'
      });

    $urlRouterProvider.otherwise('/chat');

  });
