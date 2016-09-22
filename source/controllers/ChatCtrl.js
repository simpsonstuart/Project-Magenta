angular.module('MyApp')
    .controller('ChatCtrl', function($scope, $http, toastr, $stateParams) {
        var ctrl = this;

        ctrl.UserName = window.prompt('Enter Your Name');
        console.log($stateParams);

        var socket = io();
        $scope.clicked=null;
        $scope.selected_id=null;
        $scope.msgs=null;
        $scope.my_id=null;
        $scope.is_msg_show=false;

        // join specific session with session code
        socket.emit('join', $stateParams.paringCode);

        // adds user too list of users in chat
        //socket.emit('user name',ctrl.UserName); // sending user name to the server

        socket.on('user entrance',function(data,my_id){
            //checking the user id
            if($scope.my_id==null){
                $scope.my_id=my_id;
            }
            $scope.user_show=data;
            $scope.$apply();
        });

        // send message logic
        ctrl.sendMessage = function($event){
            var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    var message_params={
                        too: $stateParams.paringCode,
                        id:$scope.selected_id,
                        msg: ctrl.message,
                        name: ctrl.UserName,
                    };
                    $scope.msg_text='';
                    socket.emit('send msg',message_params);
                }
        };

        //to highlight selected row
        $scope.clicked_highlight = function(id){
            $scope.clicked=id;
            $scope.selected_id=id;
        };

        //on exit updating the List od users
        socket.on('exit',function(data){
            $scope.user_show=data;
            $scope.$apply();
        });

        //displaying the messages.
        socket.on('get msg',function(data){
            $scope.msgs=data;
            $scope.is_msg_show=true;
            $scope.$apply();
        });
    });
