module.exports = function(port) {
    var io = require('socket.io').listen(port || 3010),
        _ = require('underscore');

    var apps = {};

    var chat = io.sockets.on('connection', function(client) {
        var appId = client.handshake.query.appId;

        if (appId) {
            //Getting app
            client.app = getApp(appId);
            client.app.connectedClients.push(client.id);

            //Adding client to app room
            client.join(appId);
            client.type = client.handshake.query.userType || 'system';

            //Client events
            client.on('joinRoom', function(data) {
                client.data = data;
                client.app.joinRoom(client);
            });
            client.on('getWaitingPosition', function() {
                client.emit('setWaiting', client.app.getWaitingPosition(client.id));
            });

            //Operator events

            //Generic events
            client.on('getStatus', function(appId) {
                client.app.updateStatusToAppListeners();
            });

            client.on('disconnect', function() {
                client.app.disconnectClient(client);
            });
        } else {
            console.error('AppId not found');
        }
    });

    function getApp(appId) {
        if (!apps[appId]) {
            apps[appId] = newApp(appId);
        }
        return apps[appId];
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function newApp(appId) {
        return {
            id: appId,
            connectedClients: [],
            disconnectClient: function(client) {
                if (client.type === 'user') {
                    this.usersWaiting = _.without(this.usersWaiting, client.id);
                } else if (client.type === 'operator') {
                    this.rooms = _.filter(this.rooms, function(room) {
                        return room.operatorId != client.id;
                    })
                }
                this.connectedClients = _.without(this.connectedClients, client.id);
                chat. in (this.id).emit('updateStatus', this.status());
            },

            rooms: [],
            openNewRoom: function(client) {
                if (client.type === 'operator') {
                    return {
                        id: guid(),
                        operatorId: client.id,
                        open: false
                    }
                }
                console.error('This client cannot open a room');
            },
            getOpenRoom: function() {
                return _.first(_.filter(this.rooms, function(room) {
                    return room.open;
                }));
            },
            joinRoom: function(client) {
                var room = this.getOpenRoom();
                if (room) {
                    room.open = false;
                    client.join(room.id);
                } else {
                    this.addUserToWaiting(client);
                }
                this.updateStatusToAppListeners();
            },

            usersWaiting: [],
            addUserToWaiting: function(client) {
                this.usersWaiting.push(client.id);
                client.emit('setWaiting', this.getWaitingPosition(client.id));
            },
            getWaitingPosition: function(clientId) {
                return _.indexOf(this.usersWaiting, clientId) + 1;
            },

            status: function() {
                return {
                    totalRooms: this.rooms.length,
                    openRooms: _.filter(this.rooms, function(room) {
                        return room.open;
                    }).length,
                    usersWaiting: this.usersWaiting.length,
                    usersConnected: this.connectedClients.length
                };
            },
            updateStatusToAppListeners: function() {
                chat. in (this.id).emit('updateStatus', this.status());
            }
        };
    }
}();