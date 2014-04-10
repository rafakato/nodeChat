require(['angular', 'socket.io'],
    function(angular, io) {
        "use strict";

        var module = angular.module('chat', []);

        module.controller('index', ['$scope', '$location',
            function($scope, $location) {
                var chat = io.connect('http://localhost:3010/', {
                    query: 'appId=' + getParameterByName('i')
                });

                chat.on('connect', function() {

                });

                chat.on('updateStatus', function(data) {
                    $scope.status = data;
                    $scope.$apply();
                });
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