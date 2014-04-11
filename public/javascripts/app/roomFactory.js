define(function() {
    "use strict";

    return function($scope, room, includeSrc) {
        return {
            room: room,
            src: includeSrc,
            typingMessage: '',
            sendMessage: function() {
                $scope.chat.emit('sendMessage', this.room.id, this.typingMessage);
                this.typingMessage = '';
            },
            closeChat: function() {

            }
        };
    };
});