require(['angular', 'socket.io', 'app/main'],
    function(angular, io, module) {
        "use strict";

        module.controller('client', ['$scope', '$timeout',
            function($scope, $timeout) {
                $scope.clientData = {
                    name: '',
                    email: ''
                };
                $scope.chat = null;
                $scope.chatStatus = {
                    status: 'idle',
                    waitPosition: -1
                };

                $scope.connect = function() {
                    $scope.chat = io.connect(configs.socketUrl, {
                        query: 'appId=' + configs.appID + '&userType=user'
                    });
                    $scope.connectionStatus = 'connecting';

                    $scope.chat.on('connect', function() {
                        $scope.connectionStatus = 'connected';
                        $timeout(function() {
                            $scope.connectionStatus = '';
                        }, 500);
                        $scope.chat.emit('openChat', $scope.clientData);
                    });

                    $scope.chat.on('setWaiting', function(position) {
                        $scope.chatStatus.waitPosition = position;
                        $scope.chatStatus.status = 'waiting';
                        $scope.$apply();
                    });

                    $scope.chat.on('updateStatus', function() {
                        $scope.chat.emit('getWaitingPosition');
                    });

                    $scope.chat.on('chatOpened', function(room) {
                        $scope.chatStatus.status = 'connected';
                        $scope.chatWindow = {
                            room: room,
                            src: '/client/chatWindow.html',
                            typingMessage: '',
                            sendMessage: function() {

                            },
                            closeChat: function() {

                            }
                        };
                        $scope.$apply();
                    });

                    $scope.chat.on('messageReceived', function(data) {
                        $scope.chatWindow.room.messages.push(data.message);
                        $scope.$apply();
                    });
                }
            }
        ]);

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['chat']);
        });
    }
);