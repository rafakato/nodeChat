define(['angular'],
    function(angular) {
        var module = angular.module('chat', []);

        module.run(['$rootScope',
            function($rootScope) {
                $rootScope.loaded = true;
            }
        ]);

        return module;
    }
);