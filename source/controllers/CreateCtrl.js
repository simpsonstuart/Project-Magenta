angular.module('MyApp')
    .controller('CreateCtrl', function($scope, $http, toastr, $stateParams, $state, $log, $mdDialog) {
        var ctrl = this;
        ctrl.createSession = () => {
            // generate password with jen library
            let hdl = new Jen(true);
            ctrl.code = hdl.password(256, 1000);
            ctrl.secret = hdl.password(256, 60000);
            // generates random udid based on offset random and current precise time
            let d = Date.now();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now(); //use high-precision timer if available
            }
            ctrl.udid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });

            // sends server the pairing code and expiry data only not password!
            $http.post('/store_code', {
                code: ctrl.code,
                displayName: ctrl.name,
                udid: ctrl.udid,
                date_from: ctrl.dateFrom,
                date_too: ctrl.dateToo,
                max_users: ctrl.maxUsers
            }).then((response) => {
                    localStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('secret', ctrl.secret);
                    $mdDialog.show({
                        contentElement: '#popupModal',
                        parent: angular.element(document.body)
                    });
                },
                (response) => {
                    if (response.status === 401) {
                       $log.info('Error storing pairing code!', response.data);
                    }
                });
        };
        // navigates too enter name state
        ctrl.goEnterName = () => {
            $mdDialog.hide();
            $mdDialog.show({
                contentElement: '#nameModal',
                parent: angular.element(document.body)
            });

        };
        // hides modal and passes data too chat
        ctrl.continue =  () => {
            $mdDialog.hide();
            $state.go('chat', { paringCode: ctrl.udid, username: ctrl.username });
        };
    });
