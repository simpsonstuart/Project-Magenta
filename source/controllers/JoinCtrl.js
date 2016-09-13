angular.module('MyApp')
    .controller('JoinCtrl', function($scope, $http, toastr, $stateParams, $state) {
        var ctrl = this;
        ctrl.joinSession = () => {
            //todo add check code and set up logic such as store in local storage
         $state.go('chat');
        }
    });
