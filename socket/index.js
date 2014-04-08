module.exports = function(port) {
    var io = require('socket.io').listen(port || 3010),
        _ = require('underscore');

    var apps = {};

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
                    this.usersWaiting = _.without(this.usersWaiting, client.id);
                } else if (client.type === 'operator') {
                    this.rooms = _.filter(this.rooms, function(room) {
                        return room.operatorId != client.id;
                    })
                }
                this.connectedClients = _.filter(this.connectedClients, function(user) {
                    return user.id != client.id;
                });
                chat. in (this.id).emit('updateStatus', this.status());
            },

            rooms: [],
            getOpenRoom: function() {
                return _.first(_.where(this.rooms, {
                    open: true
                }));
            },
            openChatAs: function() {
                var parent = this;
                return {
                    user: function(client) {
                        var room = {
                            id: guid(),
                            userId: client.id,
                            operatorId: null,
                            open: true
                        };
                        console.log(parent);
                        client.join(parent.id + '|' + room.id);
                        parent.rooms.push(room);
                        parent.addUserToWaiting(client);

                        parent.connectedClients.push(client.data);
                        parent.updateStatusToAppListeners();
                    },
                    operator: function(client, userId) {
                        var room = _.findWhere(parent.rooms, {
                            userId: userId
                        });

                        console.log(room);
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
}();