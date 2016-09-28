angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'ngMaterial'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat?paringCode&username&secret',
        controller: 'ChatCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'partials/chat.html'
      })
      .state('connect', {
          url: '/connect',
          controller: 'ConnectCtrl',
          controllerAs: 'ctrl',
          templateUrl: 'partials/connect.html'
      })
        .state('create', {
            url: '/create',
            controller: 'CreateCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'partials/create.html'
        })
        .state('join', {
            url: '/join',
            controller: 'JoinCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'partials/join.html'
        });

    $urlRouterProvider.otherwise('/chat');

  });
