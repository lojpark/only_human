var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/server', express.static(__dirname + '/server'));
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("port: 2000 open");

var SOCKET_LIST = {};

const Map = require('./server/map.js');
const Player = require('./server/human.js');
const Bullets = require('./server/bullets.js');
var map = new Map(3, 3);
var bullets = new Bullets(map);
var players = new Object();

players.list = {};

players.onConnect = function (socket) {
    let player = new Player(socket.id, 32, 48, 1, map);
    players.list[socket.id] = player;
    console.log("new player:", socket.id);

    socket.on("KEY_PRESS", function (data) {
        if (data.inputId === "UP") {
            player.isUpPress = data.isPress;
        }
        else if (data.inputId === "DOWN") {
            player.isDownPress = data.isPress;
        }
        else if (data.inputId === "RIGHT") {
            player.isRightPress = data.isPress;
        }
        else if (data.inputId === "LEFT") {
            player.isLeftPress = data.isPress;
        }

        else if (data.inputId === "JUMP") {
            player.isJumpPress = data.isPress;
        }
        else if (data.inputId === "SNIPE") {
            player.isUpPress = player.isDownPress = player.isLeftPress = player.isRightPress = false;
            player.state = "SNIPE";
        }
        else if (data.inputId === "SHOT") {
            if (player.state == "SNIPE") {
                player.fireAngle = data.angle;
            }
            
            player.state = "IDLE";

            bullets.addBullet(player.x, player.y, player.fireAngle, player.snipeRange);
        }
        else if (data.inputId === "CANCEL") {
            if (player.state == "SNIPE") {
                player.isUpPress = player.isDownPress = player.isLeftPress = player.isRightPress = false;
                player.state = "IDLE";
            }
        }
    });
}

players.onDisconnect = function (socket) {
    delete players.list[socket.id];
}

players.update = function () {
    let pack = [];
    for (let i in players.list) {
        players.list[i].update();
        pack.push({
            x: players.list[i].x,
            y: players.list[i].y,
            id: players.list[i].id,
            dir: players.list[i].dir,
            state: players.list[i].state,
            motion: players.list[i].motion,
        });
    }
    return pack;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    players.onConnect(socket);
    socket.emit("INIT_GAME", socket.id, players.list[socket.id], map.map);

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        players.onDisconnect(socket);

        for (let i in SOCKET_LIST) {
            let otherSocket = SOCKET_LIST[i];
            otherSocket.emit("REMOVE_PERSON", socket.id);
        }
    });
});

setInterval(function () {
    let pack = {
        player: players.update(),
        bullet: bullets.update(),
    }

    for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.emit("NEW_POSITION", pack);
    }

}, 1000/40);