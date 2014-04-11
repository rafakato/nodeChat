define(['angular', 'moment', 'angular-sanitize', 'angular-local-storage'],
    function(angular, moment) {
        var module = angular.module('chat', ['ngSanitize', 'LocalStorageModule']);

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

        module.filter('fromNow', ['$timeout',
            function($timeout) {
                return function(date) {
                    return moment(date).fromNow();
                }
            }
        ]);

        module.directive('time', [
            '$timeout',
            '$filter',
            function($timeout, $filter) {
                return function(scope, element, attrs) {
                    var time = attrs.time;
                    var intervalLength = 1000 * 10; // 10 seconds
                    var filter = $filter('fromNow');

                    function updateTime() {
                        element.text(filter(time));
                    }

                    function updateLater() {
                        timeoutId = $timeout(function() {
                            updateTime();
                            updateLater();
                        }, intervalLength);
                    }

                    element.bind('$destroy', function() {
                        $timeout.cancel(timeoutId);
                    });

                    updateTime();
                    updateLater();
                };  

            }
        ]);

        return module;
    }
);