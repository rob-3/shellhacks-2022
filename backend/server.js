"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var ws_1 = require("ws");
function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
require('dotenv').config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twilioClient = require('twilio')(accountSid, authToken);
var width = 50;
var updates = [];
var leaderboard = [];
var directions = {
    up: -width,
    right: 1,
    down: width,
    left: -1
};
function updateLeaderboard(player) {
    var index = leaderboard.findIndex((function (winner) { return winner.playerName === player.name && !winner.isFinal; }));
    var entry = leaderboard[index];
    if (entry && !entry.isFinal) {
        entry.score = player.score;
        while (index !== 0 && entry.score > leaderboard[index - 1].score) {
            var temp = leaderboard[index - 1];
            leaderboard[index - 1] = entry;
            leaderboard[index] = temp;
            if (index === 5) {
                sendLeaderboardText(leaderboard[5]);
            }
            index--;
        }
    }
    else {
        leaderboard.push({ playerId: player.id, playerName: player.name, score: player.score, isFinal: false, phoneNumber: player.phoneNumber });
    }
}
var Player = /** @class */ (function () {
    function Player(client, color, snake, currDirection, name, phoneNumber, score, id) {
        this.client = client;
        this.currDirection = currDirection;
        this.snake = snake;
        this.color = color;
        this.score = score;
        this.state = 'alive';
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.id = id;
    }
    return Player;
}());
var GameState = /** @class */ (function () {
    function GameState() {
        this.board = new Array(width).fill('').map(function () { return new Array(width).fill(''); });
    }
    return GameState;
}());
var Update = /** @class */ (function () {
    function Update(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    return Update;
}());
var players = [];
var gameState = new GameState();
function findOpenPosition() {
    var openSpots = [];
    for (var x = 0; x < gameState.board.length; x++) {
        for (var y = 0; y < gameState.board[x].length; y++) {
            if (gameState.board[x][y] === '') {
                openSpots.push({ x: x, y: y });
            }
        }
    }
    if (openSpots.length === 0) {
        throw Error("No more open spots");
    }
    return sample(openSpots);
}
function findApples() {
    for (var i_1 = 0; i_1 < gameState.board.length; i_1++) {
        for (var j = 0; j < gameState.board[i_1].length; j++) {
            if (gameState.board[i_1][j] == 'red') {
                updates.push(new Update(i_1, j, 'red'));
            }
        }
    }
}
function fillBoard() {
    players.forEach(function (player) {
        if (!player || player.state === 'dead')
            return;
        for (var i_2 = 0; i_2 < player.snake.length; i_2++) {
            gameState.board[Math.floor(player.snake[i_2] / width)][player.snake[i_2] % width] = player.color;
            updates.push(new Update(Math.floor(player.snake[i_2] / width), player.snake[i_2] % width, player.color));
        }
        findApples();
        var newApple = findOpenPosition();
        gameState.board[newApple['x']][newApple['y']] = 'red';
        updates.push(new Update(newApple['x'], newApple['y'], 'red'));
    });
}
function removePlayer(player) {
    for (var i_3 = 0; i_3 < player.snake.length; i_3++) {
        gameState.board[Math.floor(player.snake[i_3] / width)][player.snake[i_3] % width] = '';
        updates.push(new Update(Math.floor(player.snake[i_3] / width), player.snake[i_3] % width, ''));
    }
    player.snake = [];
}
function moveOutcome(player) {
    if (checkForHits(player)) {
        player.state = 'dead';
        removePlayer(player);
    }
    else {
        moveSnake(player);
    }
}
;
// The value at the head indicates index within game board
function moveSnake(player) {
    var tail = player.snake.pop();
    // Remove tail from gameboard
    gameState.board[Math.floor(tail / width)][tail % width] = '';
    player.snake.unshift(player.snake[0] + directions[player.currDirection]);
    updates.push(new Update(Math.floor(tail / width), tail % width, ''));
    eatApple(player, tail);
    gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = player.color;
    updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, player.color));
}
function checkForHits(player) {
    var dir = directions[player.currDirection];
    if ((player.snake[0] + width >= width * width && dir === width) ||
        (player.snake[0] % width === width - 1 && dir === 1) ||
        (player.snake[0] % width === 0 && dir === -1) ||
        (player.snake[0] - width <= 0 && dir === -width)) {
        return true;
    }
    var head = player.snake[0];
    var nextCell = head + dir;
    var nextY = Math.floor(nextCell / width);
    var nextX = nextCell % width;
    if ((gameState.board[nextY][nextX] !== 'red') &&
        (gameState.board[nextY][nextX] !== '')) {
        players.forEach(function (collision) {
            for (var _i = 0, _a = collision.snake; _i < _a.length; _i++) {
                var otherSnakeCell = _a[_i];
                if (gameState.board[nextY][nextX] === collision.color && nextCell === otherSnakeCell) {
                    collision.score += 5;
                    updateLeaderboard(collision);
                }
            }
        });
        return true;
    }
    return false;
}
function eatApple(player, tail) {
    if (gameState.board[Math.floor(player.snake[0] / width)][(player.snake[0] % width)] == 'red') {
        gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = '';
        updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, ''));
        gameState.board[Math.floor(tail / width)][tail % width] = player.color;
        updates.push(new Update(Math.floor(tail / width), tail % width, player.color));
        player.snake.push(tail);
        var newApple = findOpenPosition();
        gameState.board[newApple['x']][newApple['y']] = 'red';
        updates.push(new Update(newApple['x'], newApple['y'], 'red'));
        player.score++;
        updateLeaderboard(player);
    }
}
function generatePlayer(client, color, size, name, phoneNumber, score, id) {
    var coords = findOpenPosition();
    var dir = coords['y'] > Math.floor(width / 2) ? 'left' : 'right';
    var snake = [];
    if (dir == 'left') {
        for (var i_4 = 0; i_4 < size; i_4++) {
            snake.push(coords['x'] * width + coords['y'] + i_4);
        }
    }
    else {
        for (var i_5 = 0; i_5 < size; i_5++) {
            snake.push(coords['x'] * width + coords['y'] - i_5);
        }
    }
    return new Player(client, color, snake, dir, name, phoneNumber, score, id);
}
function sendLeaderboardText(player) {
    twilioClient.messages
        .create({
        body: "Somebody knocked you off the leaderboard! Looks like it's time to put your financial literacy skills to the test again!",
        from: "+19717913081",
        to: player.phoneNumber
    })
        .then(function (message) { return console.log(message.sid); });
}
var socket = new ws_1.WebSocketServer({ port: 8081 });
var i = 0;
socket.on("connection", function (ws) {
    console.log("player ".concat(i, " has connected"));
    var id = i++;
    ws.on("message", function (data) {
        var messageString = data.toString();
        // Check with team on request structure
        if (messageString === 'quiz_success') {
            var existingPlayer = players.find(function (p) { return p.id === id; });
            if (!existingPlayer) {
                throw Error("couldn't match existingPlayer to a real player");
            }
            var index = players.findIndex(function (p) { return p.id === id; });
            players[index] = generatePlayer(ws, existingPlayer.color, Math.max(3, existingPlayer.snake.length - 2), existingPlayer.name, existingPlayer.phoneNumber, existingPlayer.score, id);
            fillBoard();
        }
        // Check with team on request structure
        else if (messageString !== 'up' && messageString !== 'down' && messageString !== 'left' && messageString !== 'right') {
            var player = JSON.parse(data.toString());
            players.push(generatePlayer(ws, player.color, 3, player.name, player.phoneNumber, 0, id));
            fillBoard();
        }
        else {
            var player = players.find(function (p) { return p.id === id; });
            if (!player) {
                throw Error("Couldn't find player!");
            }
            if (directions[messageString] !== -directions[player.currDirection]) {
                player.currDirection = messageString;
            }
        }
    });
    ws.on("close", function () {
        var entry = leaderboard.find(function (_a) {
            var playerId = _a.playerId, isFinal = _a.isFinal;
            return playerId === id && !isFinal;
        });
        if (entry) {
            entry.isFinal = true;
        }
        var index = players.findIndex(function (p) { return p.id === id; });
        if (index === -1) {
            throw Error("Player couldn't be found when removing!");
        }
        removePlayer(players[index]);
        players.splice(index, 1);
        console.log("Player " + id + " has disconnected");
    });
});
setInterval(function () {
    players.forEach(function (player) {
        if (player && player.state === 'alive') {
            moveOutcome(player);
        }
    });
    players.forEach(function (player) {
        var noPhoneLeaderboard = leaderboard.slice(0, 5).map(function (_a) {
            var _ = _a.phoneNumber, entry = __rest(_a, ["phoneNumber"]);
            return entry;
        });
        if (player) {
            player.client.send(JSON.stringify({ gameState: updates, playerState: player.state, leaderboard: noPhoneLeaderboard }));
        }
    });
    updates = [];
}, 200);
