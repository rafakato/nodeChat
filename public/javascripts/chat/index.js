(function() {
    "use strict";

    var module = angular.module('chat', []);
    module.config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.html5Mode(true);
        }
    ]);

    module.controller('index', ['$scope', '$location',
        function($scope, $location) {
            var chat = io.connect('http://localhost:3010/', {
                query: 'appID=' + ($location.search()).i
            });

            chat.on('connect', function() {
                chat.emit('getStatus');
            });

            chat.on('updateStatus', function(data) {
                $scope.status = data;
                $scope.$apply();
            });
        }
    ]);
})();