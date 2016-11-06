angular.module('MyApp')
    .controller('JoinCtrl', function($scope, $http, toastr, $stateParams, $state, $log) {
        var ctrl = this;
        ctrl.joinSession = () => {
            $http.post('/join_session', {
                code: ctrl.code,
                udid: ctrl.udid,
            }).then((response) => {
                    localStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('secret', ctrl.secret);
                    $state.go('chat', { paringCode: ctrl.udid, username: ctrl.userName });
                },
                (response) => {
                    if (response.status === 401) {
                        toastr.error('Invalid Session Code! Please try again.');
                    }
                    if (response.status === 404) {
                        toastr.error('Session ID not found!');
                    }
                    if (response.status === 403) {
                        toastr.error(response.data.message);
                    }
                });
        }
    });
