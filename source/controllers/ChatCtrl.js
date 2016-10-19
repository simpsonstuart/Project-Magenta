angular.module('MyApp')
    .controller('ChatCtrl', function($scope, $http, toastr, $stateParams, $state) {
        var ctrl = this;
        ctrl.UserName = $stateParams.username;
        let socket = io();
        $scope.clicked=null;
        $scope.msgs=null;
        $scope.my_id=null;
        ctrl.messages = [];

        // kicks user too join if code and username missing
        if(!$stateParams.username || !$stateParams.paringCode) {
            $state.go('join');
        }

        // join specific session with session code
        socket.emit('join', $stateParams.paringCode);

        // adds user too list of users in chat
        socket.emit('user name',ctrl.UserName, $stateParams.paringCode);

        socket.on('user entrance', function(data,my_id){
            //checking the user id
            if($scope.my_id==null){
                $scope.my_id=my_id;
            }
            // maybe add code here too add self too array on init
            ctrl.users = data;
            $scope.$apply();
        });

        // send message logic
        ctrl.sendMessage = function($event){
            // on enter key send message
            let keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    let encrypted = CryptoJS.AES.encrypt(ctrl.message, $stateParams.secret).toString();
                    let message_params= {
                        too: $stateParams.paringCode,
                        msg: encrypted,
                        from: CryptoJS.AES.encrypt(ctrl.UserName, $stateParams.secret).toString(),
                        checksum: CryptoJS.SHA3(encrypted).toString(),
                        timestamp: Date.now(),
                        token: localStorage.getItem('token'),
                    };
                    socket.emit('send msg',message_params);

                    // show the message we sent too ourselves in decrypted form
                    let message = {
                        too: message_params.too,
                        msg: ctrl.message,
                        from: `${ctrl.UserName} (Me)`,
                        timestamp: message_params.timestamp,
                    };
                    ctrl.messages.push(message);
                    ctrl.message = '';
                }
        };
        
        //on exit remove user from list
        socket.on('exit',function(data){
            ctrl.users = data;
            $scope.$apply();
        });

        //displaying the messages.
        socket.on('get msg',function(data){
            // create a decrypted message object and push into array of messages
            let message = {
                too: data.too,
                msg: CryptoJS.AES.decrypt(data.msg, $stateParams.secret).toString(CryptoJS.enc.Utf8),
                from: CryptoJS.AES.decrypt(data.from , $stateParams.secret).toString(CryptoJS.enc.Utf8),
                checksum: data.checksum,
                timestamp: data.timestamp,
            };

            if (data.checksum === CryptoJS.SHA3(data.msg).toString()) {
                ctrl.messages.push(message);
            } else {
                toastr.error('Non authentic message received!');
            }
            $scope.$apply();
        });

        socket.on('bad auth',function(data){
            toastr.error(Data);
            $scope.$apply();
        });

        // hides modal
        ctrl.continue =  () => {
            $mdDialog.hide();
        };
    });
