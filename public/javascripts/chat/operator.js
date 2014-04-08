(function() {
    "use strict";

    var module = angular.module('chat', []);
    module.config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.html5Mode(true);
        }
    ]);

    module.controller('client', ['$scope', '$location',
        function($scope, $location) {
            $scope.clientData = {};
            $scope.chat = null;
            $scope.chatStatus = {
                status: 'idle',
                waitPosition: -1
            };

            $scope.connect = function() {
                $scope.chat = io.connect('http://localhost:3010/', {
                    query: 'appID=' + ($location.search()).i + '&userType=operator'
                });

                $scope.chat.on('connect', function() {
                    $scope.chat.emit('findAndEnterRoom', $scope.clientData);
                });

                $scope.chat.on('setWaiting', function(position) {
                    console.log(position);
                    $scope.chatStatus.waitPosition = position;
                    $scope.chatStatus.status = 'waiting';
                    $scope.$apply();
                });
            }
        }
    ]);
})();

/*
var chat = io.connect('http://localhost:3010/');

    chat.on('connect', function() {
        chat.on('updatechat', function(msg) {
            document.getElementById('messages').innerHTML += '<p>' + msg + '</p>';

            document.getElementById('connect').style.display = 'none';
            document.getElementById('connected').style.display = 'block';
        });
        chat.on('room_closed', function(msg) {
            document.getElementById('messages').innerHTML = '';
            document.getElementById('connect').style.display = 'block';
            document.getElementById('connected').style.display = 'none';
        });
        chat.on('open_rooms_count', function(msg) {
            document.getElementById('totalRooms').innerText = msg;
        });
        chat.on('room_id', function(roomId) {
            chat.room = roomId;
        });
        chat.on('wait_in_line', function(position) {
            document.getElementById('waitPosition').innerText = position;
            document.getElementById('connect').style.display = 'none';
            document.getElementById('wait').style.display = 'block';
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('openChat').addEventListener('click', function() {
            var nickname = document.getElementById('nickname').value;

            connect(nickname, false);
        });

        document.getElementById('openRoom').addEventListener('click', function() {
            var nickname = document.getElementById('nickname').value;

            connect(nickname, true);
        });

        document.getElementById('sendMessage').addEventListener('click', function() {
            var message = document.getElementById('message').value;

            chat.emit('send_message', message);
        });

        document.getElementById('exit').addEventListener('click', function() {
            chat.emit('disconnect', message);
        });
    }, false);


    function connect(nickname, openRoom) {
        if (openRoom) {
            chat.emit('open_new_room', nickname);
        } else {
            chat.emit('enter_room', nickname);
        }
    };
 */