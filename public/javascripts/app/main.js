define(['angular', 'angular-local-storage'],
    function(angular) {
        var module = angular.module('chat', ['LocalStorageModule']);

        module.run(['$rootScope',
            function($rootScope) {
                $rootScope.loaded = true;
            }
        ]);

        module.config(['localStorageServiceProvider',
            function(localStorageServiceProvider) {
                localStorageServiceProvider.setPrefix('SChat');
            }
        ]);

        return module;
    }
);