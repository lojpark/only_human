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
const Human = require('./server/human.js');
const Robots = require('./server/robots.js');
const Bullets = require('./server/bullets.js');
const LeaderBoard = require('./server/leaderboard.js');
var map = new Map(3, 3);
var leaderboard = new LeaderBoard();
var bullets = new Bullets(map);

var players = new Object();
players.list = {};

var robots = new Robots(players.list, bullets, leaderboard, map);
robots.spawnRobots(0, 35);

players.onConnect = function (socket) {
    let player = new Human(socket.id, 32, 48, 1, bullets, leaderboard, map);
    players.list[socket.id] = player;
    leaderboard.update(socket.id, "CREATE");
    console.log("player in:", socket.id);

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
                bullets.addBullet(player.id, player.x, player.y, data.angle, player.snipeRange);
            }
            else {
                bullets.addBullet(player.id, player.x, player.y, player.fireAngle, player.snipeRange);
            }

            player.state = "IDLE";
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
    console.log("player out:", socket.id);

    delete players.list[socket.id];
    leaderboard.update(socket.id, "DIE");
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

const FPS = 60, FRAME_INTERVAL = 1000 / FPS;

setInterval(function () {
    let pack = {
        player: players.update(),
        robot: robots.update(),
        bullet: bullets.update(),
        leaderboard: leaderboard.update(null, "PACKING"),
    }

    for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.emit("NEW_POSITION", pack);
    }

}, FRAME_INTERVAL);