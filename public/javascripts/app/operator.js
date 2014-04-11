require(['angular', 'socket.io', 'underscore', 'app/main'],
    function(angular, io, _, module) {
        "use strict";

        module.controller('operator', ['$scope', '$timeout', 'localStorageService',
            function($scope, $timeout, localStorageService) {
                var init = function() {
                    $scope.clientData = {
                        name: '',
                        email: ''
                    };
                    $scope.rooms = [];

                    $scope.chat = null;
                    $scope.chatStatus = {
                        status: 'idle'
                    };

                    $scope.chatWindows = [];
                }
                init();

                $scope.connect = function() {
                    $scope.chat = io.connect(configs.socketUrl, {
                        query: 'appId=' + configs.appID + '&userType=operator'
                    });
                    $scope.connectionStatus = 'connecting';

                    $scope.chat.on('connect', function() {
                        $scope.connectionStatus = 'connected';
                        $timeout(function() {
                            $scope.connectionStatus = '';
                        }, 500);

                        localStorageService.add('loggedUser', $scope.clientData);
                        $scope.chat.emit('setData', $scope.clientData);
                        $scope.chatStatus.status = 'connected';
                    });

                    $scope.chat.on('updateStatus', function(data) {
                        $scope.status = data;
                        $scope.$apply();
                    });

                    $scope.chat.on('chatOpened', function(room) {
                        console.log(room);
                        $scope.chatWindows.push({
                            room: room,
                            src: '/operator/chatWindow.html',
                            typingMessage: '',
                            sendMessage: function() {

                            },
                            closeChat: function() {

                            }
                        });
                        $scope.$apply();
                    });

                    $scope.chat.on('messageReceived', function(data) {
                        var chatWindow = _.find($scope.chatWindows, function(chatWindow) {
                            return chatWindow.room.id === data.toRoom;
                        });
                        chatWindow.room.messages.push(data.message);
                        $scope.$apply();
                    });
                }

                $scope.openChat = function(userId) {
                    $scope.chat.emit('openChat', userId);
                }

                $scope.exit = function() {
                    localStorageService.remove('loggedUser');
                    init();
                }

                if (localStorageService.get('loggedUser')) {
                    angular.extend($scope.clientData, localStorageService.get('loggedUser'))
                    $scope.connect();
                }
            }
        ]);

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['chat']);
        });
    }
);