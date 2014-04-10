require(['angular', 'socket.io', 'app/main'],
    function(angular, io, module) {
        "use strict";

        module.controller('index', ['$scope', '$timeout',
            function($scope, $timeout) {
                $scope.chatStatus = 'connecting';
                var chat = io.connect(configs.socketUrl, {
                    query: 'appId=' + configs.appID
                });

                chat.on('connect', function() {
                    $scope.chatStatus = 'connected';
            $timeout(function() {
                $scope.chatStatus = '';
            }, 500);
                });

                chat.on('updateStatus', function(data) {
                    $scope.status = data;
                    $scope.$apply();
                });
            }
        ]);

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['chat']);
        });
    }
);