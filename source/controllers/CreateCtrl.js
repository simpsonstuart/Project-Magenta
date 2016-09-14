angular.module('MyApp')
    .controller('CreateCtrl', function($scope, $http, toastr, $stateParams, $state, $log) {
        var ctrl = this;
        ctrl.createSession = () => {
            //todo add modal popup with logic creater that generates codes from values
            ctrl.code ='4328328732832458923hhfsdfh34h5fgh54d';
            
            // generates random udid based on offset random and current precise time
            let d = Date.now();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now(); //use high-precision timer if available
            }
            const udid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });

            // sends server the pairing code and expiry data only not password!
            $http.post('/store_code', {
                code: ctrl.code,
                displayName: ctrl.name,
                udid: udid,
                date_from: ctrl.dateFrom,
                date_too: ctrl.dateToo,
                max_users: ctrl.maxUsers
            }).then((response) => {
                    localStorage.setItem('token', response.data.token);
                    $state.go('chat');
                },
                (response) => {
                    if (response.status === 401) {
                       $log.info('Error storing pairing code!', response.data);
                    }
                });
        };
    });
