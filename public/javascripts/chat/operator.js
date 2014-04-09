(function() {
    "use strict";

    var module = angular.module('chat', []);

    module.controller('operator', ['$scope',
        function($scope) {
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

            $scope.connect = function() {
                $scope.chat = io.connect('http://localhost:3010/', {
                    query: 'appId=' + getParameterByName('i') + '&userType=operator'
                });

                $scope.chat.on('connect', function() {
                    $scope.chat.emit('setData', $scope.clientData);
                    $scope.chatStatus.status = 'connected';
                });

                $scope.chat.on('updateStatus', function(data) {
                    $scope.status = data;
                    $scope.$apply();
                });

                $scope.chat.on('chatOpened', function(room) {
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
            }

            $scope.openChat = function(userId) {
                $scope.chat.emit('openChat', userId);
            }
        }
    ]);

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
})();