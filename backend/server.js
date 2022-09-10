const WebSocket = require('ws')
const alert = require('alert-node')
const http = require('http');
let width = 100
const directions = {
  up: -width,
  right: 1,
  down: width,
  left: -1
}

let interval = setInterval(() => {
  socket.clients.forEach((client) => {
    moveOutcome();
    client.send(JSON.stringify(gameState));
  });
}, 1000);

class Player {
  constructor() {
    this.currDirection = 'right'
    this.locations = new Array()
  }
}

class GameState {
  constructor() {
    this.board = new Array(width).fill(0).map(() => new Array(width).fill(0))
    this.playerState = 'alive'
  }
}

const player = new Player();
const gameState = new GameState();
currentSnake = [2, 1, 0]

function moveOutcome() {
  if (checkForHits()) {
    alert("you hit something");
    gameState.playerState = 'dead';
  } else {
    moveSnake();
  }
}
// The value at the head indicates index within game board
function moveSnake() {
  let tail = currentSnake.pop();
  // Remove tail from gameboard
  gameState.board[Math.floor(tail / width)][tail % width] = 0
  currentSnake.unshift(currentSnake[0] + directions[player.currDirection]);
  // movement ends here
  gameState.board[Math.floor(currentSnake[0] / width)][currentSnake[0] % width] = 1
}

function checkForHits() {
  if (
    (currentSnake[0] + width >= width * width && directions[player.currDirection] === width) ||
    (currentSnake[0] % width === width - 1 && directions[player.currDirection] === 1) ||
    (currentSnake[0] % width === 0 && directions[player.currDirection] === -1) ||
    (currentSnake[0] - width <= 0 && directions[player.currDirection] === -width) ||
    gameState.board[currentSnake[0] + directions[player.currDirection]] == 1
  ) {
    return true;
  } else {
    return false;
  }
}

let socket = new WebSocket.Server({ port: 8081 });

socket.on("connection", (ws) => {
  alert('someone connected!');

  ws.on("message", (data) => {
    console.log("Message received: " + data.toString());
    player.currDirection = data.toString();
  })
})



socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};