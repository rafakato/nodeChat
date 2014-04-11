module.exports = function(app) {
    var io = require('socket.io').listen(app.get('socket-port')),
        _ = require('underscore'),
        moment = require('moment');

    var apps = {};

    var greetingMessage = 'Hi [user.name], my name is [operator.name].<br />How can I help you?';

    var chat = io.sockets.on('connection', function(client) {
        var appId = client.handshake.query.appId;

        if (appId) {
            //Getting app
            client.app = getApp(appId);

            //Adding client to app room
            client.join(appId);
            client.type = client.handshake.query.userType || 'system';

            //Client events
            if (client.type === 'user') {
                client.on('openChat', function(data) {
                    setClientData(client, data);
                    client.app.openChatAs().user(client);
                });
                client.on('getWaitingPosition', function() {
                    client.emit('setWaiting', client.app.getWaitingPosition(client.id));
                });
            }

            //Operator events
            if (client.type === 'operator') {
                client.on('openChat', function(userId) {
                    client.app.openChatAs().operator(client, userId);
                });
            }

            //Generic events
            client.on('setData', function(data) {
                setClientData(client, data);
            });
            client.on('getStatus', function(appId) {
                client.app.updateStatusToAppListeners();
            });
            client.on('sendMessage', function(roomId, message) {
                client.app.sendMessageToRoom(client, roomId, message);
            });

            client.on('disconnect', function() {
                client.app.disconnectClient(client);
            });

            client.app.updateStatusToAppListeners();
        } else {
            console.error('AppId not found');
        }
    });

    function setClientData(client, data) {
        data.id = client.id;
        data.type = client.type;
        client.data = data;
    }

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
                    this.rooms = _.filter(this.rooms, function(room) {
                        return room.user.id != client.id;
                    });
                    this.usersWaiting = _.without(this.usersWaiting, client.id);
                } else if (client.type === 'operator') {
                    _.each(_.filter(this.rooms, function(room) {
                        return room.operatorId != client.id;
                    }), function(room) {
                        room.open = true;
                        room.operator = null;
                        room.messages = [];
                        room.startedAt = null;
                    });
                }
                this.connectedClients = _.filter(this.connectedClients, function(user) {
                    return user.id != client.id;
                });
                chat. in (this.id).emit('updateStatus', this.status());
            },

            rooms: [],
            getRoom: function(params) {
                return _.find(this.rooms, function(room) {
                    return (room.user.id == params.userId || params.userId === undefined) &&
                        (room.id == params.roomId || params.roomId === undefined) &&
                        (room.open == params.onlyOpen || params.onlyOpen === undefined);
                });
            },
            sendMessageToRoom: function(client, roomId, message) {
                var room = this.getRoom({
                    roomId: roomId
                });
                var message = {
                    timestamp: moment(),
                    text: message,
                    user: client.data
                };
                room.messages.push(message);
                io.sockets. in (room._getSocketRoomId()).emit('messageReceived', {
                    toRoom: roomId,
                    message: message
                });
            },
            openChatAs: function() {
                var app = this;
                return {
                    user: function(client) {
                        var room = {
                            id: guid(),
                            appId: app.id,
                            user: client.data,
                            userTyping: false,
                            operator: null,
                            operatorTyping: false,
                            open: true,
                            startedAt: null,
                            messages: [],
                            _getSocketRoomId: function() {
                                return this.appId + '|' + this.id;
                            },
                        };
                        client.join(room._getSocketRoomId());
                        app.rooms.push(room);
                        app.addUserToWaiting(client);

                        app.connectedClients.push(client.data);
                        app.updateStatusToAppListeners();
                    },
                    operator: function(client, userId) {
                        var room = app.getRoom({
                            open: true
                        });
                        if (room) {
                            var socketRoomId = room._getSocketRoomId();
                            client.join(socketRoomId);

                            room.open = false;
                            room.operator = client.data;
                            room.startedAt = moment();
                            io.sockets. in (socketRoomId).emit('chatOpened', room);
                            var firstMessage = greetingMessage.replace('[user.name]', room.user.name).replace('[operator.name]', room.operator.name);
                            app.sendMessageToRoom(client, room.id, firstMessage);
                        } else {
                            client.emit('chatOpen.error');
                        }
                    }
                }
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
                    usersConnected: {
                        operators: _.where(this.connectedClients, {
                            type: 'operator'
                        }),
                        users: _.where(this.connectedClients, {
                            type: 'user'
                        })
                    }
                };
            },
            updateStatusToAppListeners: function() {
                chat. in (this.id).emit('updateStatus', this.status());
            }
        };
    }
};