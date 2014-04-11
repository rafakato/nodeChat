require(['angular', 'socket.io', 'app/main'],
    function(angular, io, module) {
        "use strict";

        module.controller('index', ['$scope', '$timeout', 'gettext',
            function($scope, $timeout, gettext) {
                console.log(gettext);
                $scope.connectionStatus = gettext('connecting');
                var chat = io.connect(configs.socketUrl, {
                    query: 'appId=' + configs.appID
                });

                chat.on('connect', function() {
                    $scope.connectionStatus = gettext('connected');
                    $timeout(function() {
                        $scope.connectionStatus = '';
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