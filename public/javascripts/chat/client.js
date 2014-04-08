(function() {
    "use strict";

    var module = angular.module('chat', []);

    module.controller('client', ['$scope',
        function($scope) {
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
                $scope.chat = io.connect('http://localhost:3010/', {
                    query: 'appId=' + getParameterByName('i') + '&userType=user'
                });

                $scope.chat.on('connect', function() {
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