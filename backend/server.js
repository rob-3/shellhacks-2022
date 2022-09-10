const alert = require('alert-node')
var _ = require('lodash');
const WebSocket = require('ws')

let width = 100
let speed = 0.8

const directions = {
  up: -width,
  right: 1,
  down: width,
  left: -1
}

class Player {
  constructor(client, color) {
    this.client = client
    this.currDirection = 'right'
    this.snake = [2, 1, 0]
    this.color = color
    this.score = 0
    this.state = 'alive'
  }
}

class GameState {
  constructor() {
    this.board = new Array(width).fill('').map(() => new Array(width).fill(''))
  }
}

const players = new Array();
const gameState = new GameState();

function fillBoard()
{
  players.forEach((player) => {
    for (let i = 0; i < player.snake.length; i++)
    {
      gameState.board[Math.floor(player.snake[i] / width)][player.snake[i] % width] = player.color
      
    }
  });
}

function moveOutcome(player) {
    if (checkForHits(player)) {
      player.state = 'dead';
    } else {
      moveSnake(player);
    }
  };

// The value at the head indicates index within game board
function moveSnake(player) {
  let tail = player.snake.pop();
  // Remove tail from gameboard
  gameState.board[Math.floor(tail / width)][tail % width] = ''
  player.snake.unshift(player.snake[0] + directions[player.currDirection]);
  eatApple(player, tail);
  gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = player.color
}

function checkForHits(player) {
  if (
    (player.snake[0] + width >= width * width && directions[player.currDirection] === width) ||
    (player.snake[0] % width === width - 1 && directions[player.currDirection] === 1) ||
    (player.snake[0] % width === 0 && directions[player.currDirection] === -1) ||
    (player.snake[0] - width <= 0 && directions[player.currDirection] === -width) ||
    gameState.board[Math.floor((player.snake[0] + directions[player.currDirection]) 
      / width)][(player.snake[0] + directions[player.currDirection]
      % width)] == player.color
  ) {
    return true;
  } else {
    return false;
  }
}

function eatApple(player, tail) {
  if (gameState.board[Math.floor(player.snake[0] / width)][(player.snake[0] % width)] == 'red') {
    gameState.board[Math.floor(player.snake[0] / width)][(player.snake[0] % width)] = ''
    gameState.board[Math.floor(tail / width)][tail % width] = player.color
    player.snake.push(tail);
    let newApple = findOpenPosition()
    gameState.board[newApple['x']][newApple['y']] = 'red'
    player.score++;
  }
}

function findOpenPosition(){
	var openSpots = [];
	for (var x = 0; x < gameState.board.length; x++) {
		for (var y = 0; y < gameState.board[x].length; y++) {
			if(gameState.board[x][y] == '')
				openSpots.push({x:x,y:y});
		};
	};

	if(openSpots.length==0)
		return null;
    
	return _.sample(openSpots);
}

let socket = new WebSocket.Server({ port: 8081 });

let i = 0;
socket.on("connection", (ws) => {
  let id = i++;
  // Create a new player object on connection
  ws.on("message", (data) => {
    let messageString = data.toString()
    if (messageString != 'up' && messageString != 'down' && messageString != 'left' && messageString != 'right')
    {
      players.push(new Player(ws, messageString))
      fillBoard()
    }
    else
    {
      if (directions[data.toString()] != -directions[players[id].currDirection])
        players[id].currDirection = data.toString();
    }
    console.log("Message received: " + data.toString());
    
  })
})

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};

let interval = setInterval(() => {
  players.forEach((player) => {
    moveOutcome(player);
    player.client.send(JSON.stringify({gameState: gameState, playerState: player.state}));
  });
}, 200);
