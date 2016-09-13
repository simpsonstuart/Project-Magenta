angular.module('MyApp')
    .controller('CreateCtrl', function($scope, $http, toastr, $stateParams) {
        var ctrl = this;
        ctrl.createSession = () => {
            //todo add modal popup with logic creater that generates codes from values
            ctrl.code ='4328328732832458923hhfsdfh34h5fgh54d';
            
            $http.post('app.API_URI/store_code', { code: ctrl.code, displayName: ctrl.name, date_from: ctrl.dateFrom, date_too: ctrl.dateToo }).then((response) => {
                    localStorage.setItem('token', response.data.token);
                    $state.go('chat');
                },
                (response) => {
                    if (response.status === 401) {
                       //todo error message
                    }
                });
        };
    });
