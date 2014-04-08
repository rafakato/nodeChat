module.exports = function(port) {
    var io = require('socket.io').listen(port || 3010),
        _ = require('underscore');

    var chatRooms = [];
    var usersWaiting = [];

    io.set('authorization', function(handshakeData, callback) {
        callback(null, true);
    });

    var chat = io.sockets.on('connection', function(client) {
        var appID = client.handshake.query.appID;

        //Conectando na sala do applicativo
        client.join(appID);
        client.type = client.handshake.query.userType;

        client.on('findAndEnterRoom', function(data) {
            var room = getOpenRoom();
            if (room) {
                room.open = false;
                client.join(room.id);
            } else {
                usersWaiting.push(client.id);
                client.emit('setWaiting', _.indexOf(usersWaiting, client.id) + 1);
            }
            updateStatus(appID);
        });

        client.on('getStatus', function(appID) {
            updateStatus(appID);
        });

        client.on('disconnect', function() {
            if (client.type === 'user') {
                usersWaiting = _.without(usersWaiting, client.id);
            } else if (client.type === 'operator') {
                chatRooms = _.without(chatRooms, _.filter(chatRooms, function(room) {
                    return room.operatorId == client.id;
                }));
            }
        });
    });

    function updateStatus(appID) {
        chat. in (appID).emit('updateStatus', {
            totalRooms: chatRooms.length,
            openRooms: _.filter(chatRooms, function(room) {
                return room.open;
            }).length,
            usersWaiting: usersWaiting.length
        });
    }

    function getOpenRoom() {
        return _.first(_.filter(chatRooms, function(room) {
            return room.open;
        }));
    }

    function newChatRoom(operatorId) {
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        return {
            id: guid(),
            operatorId: operatorId,
            open: false
        }
    }
}();

/*
client.on('enter_room', function(nickname) {
            client.username = nickname;

            var room = enterRoom();
            if (room) {
                client.emit('updatechat', 'Hello ' + client.username);
                client.broadcast.to(room.id).emit('updatechat', client.username + ' connected');
            } else {
                client.waiting = true;
                client.emit('wait_in_line', _.indexOf(usersWaiting, client.id) + 1);
            }
            sendTotalRooms();
        });

        client.on('send_message', function(message) {
            chat. in (client.room).emit('updatechat', message);
        });

        client.on('open_new_room', function(nickname) {
            client.username = nickname;

            if (!chatRooms[client.id]) {
                chatRooms[client.id] = [];
            }
            var newRoom = {
                id: guid(),
                operatorId: client.id,
                operator: nickname,
                open: true,
                connectedTo: null,
                messages: []
            };
            chatRooms[client.id].push(newRoom);

            client.join(newRoom.id);

            client.emit('room_id', newRoom.id);

            sendTotalRooms();
        });

        client.on('disconnect', function() {
            if (chatRooms[client.id]) {
                _.each(chatRooms[client.id], function(room) {
                    client.broadcast.to(room.id).emit('room_closed');
                });
                delete chatRooms[client.id];
            } else {
                _.each(_.filter(_.flatten(_.map(chatRooms, function(rooms) {
                    return rooms;
                })), function(room) {
                    return room.connectedTo == client.id;
                }), function(room) {
                    room.open = false;
                });
                updateWaitposition();
            }
            sendTotalRooms();
        });

        function updateWaitposition() {

        }

        function sendTotalRooms() {
            var totalRooms = _.filter(_.flatten(_.map(chatRooms, function(rooms) {
                return rooms;
            })), function(room) {
                return room.open;
            }).length;
            chat.emit('open_rooms_count', totalRooms);
        };

        function enterRoom() {
            var allOpenRooms = _.filter(_.flatten(_.map(chatRooms, function(rooms) {
                return rooms;
            })), function(room) {
                return room.open;
            });

            if (allOpenRooms && allOpenRooms.length) {
                var room = allOpenRooms[0];
                room.open = false;
                room.connectedTo = client.id;
                client.room = room.id;
                client.join(room.id);
                return room;
            } else {
                usersWaiting.push(client.id);
                return null;
            }
        }
 */