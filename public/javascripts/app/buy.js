require(['angular', 'socket.io', 'app/main'],
    function(angular, io, module) {
        "use strict";

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['chat']);
        });
    }
);