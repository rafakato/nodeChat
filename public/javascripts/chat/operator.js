(function() {
    "use strict";

    var module = angular.module('chat', []);

    module.controller('operator', ['$scope',
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
                    query: 'appId=' + getParameterByName('i') + '&userType=operator'
                });

                $scope.chat.on('connect', function() {
                    //connected
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