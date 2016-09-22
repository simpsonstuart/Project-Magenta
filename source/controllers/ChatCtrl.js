angular.module('MyApp')
    .controller('ChatCtrl', function($scope, $http, toastr, $stateParams, $state) {
        var ctrl = this;
        ctrl.UserName = $stateParams.username;
        let socket = io();
        $scope.clicked=null;
        $scope.msgs=null;
        $scope.my_id=null;
        ctrl.messages = [];

        if(!$stateParams.username || !$stateParams.paringCode) {
            $state.go('join');
        }

        // join specific session with session code
        socket.emit('join', $stateParams.paringCode);

        // adds user too list of users in chat
        socket.emit('user name',ctrl.UserName);

        socket.on('user entrance',function(data,my_id){
            //checking the user id
            if($scope.my_id==null){
                $scope.my_id=my_id;
            }
            ctrl.users = data;
            $scope.$apply();
        });

        // send message logic
        ctrl.sendMessage = function($event){
            var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    var message_params={
                        too: $stateParams.paringCode,
                        msg: ctrl.message,
                        from: ctrl.UserName,
                    };
                    socket.emit('send msg',message_params);
                    ctrl.message = '';
                }
        };

        //to highlight selected row
        $scope.clicked_highlight = function(id){
            $scope.clicked=id;
            $scope.selected_id=id;
        };

        //on exit remove user from list
        socket.on('exit',function(data){
            ctrl.users = data;
            $scope.$apply();
        });

        //displaying the messages.
        socket.on('get msg',function(data){
            ctrl.messages.push(data);
            $scope.$apply();
        });
    });
