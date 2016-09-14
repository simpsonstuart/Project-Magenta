angular.module('MyApp')
    .controller('JoinCtrl', function($scope, $http, toastr, $stateParams, $state, $log) {
        var ctrl = this;
        ctrl.joinSession = () => {
            $http.post('/join_session', {
                code: ctrl.code,
                udid: ctrl.udid,
            }).then((response) => {
                    localStorage.setItem('token', response.data.token);
                    $state.go('chat');
                },
                (response) => {
                    if (response.status === 401) {
                        toastr.error('Invalid Session Code! Please try again.');
                    }
                });
        }
    });
