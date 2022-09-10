const alert = require('alert-node')
var _ = require('lodash');
const WebSocket = require('ws')

let width = 50
let updates = []

const directions = {
  up: -width,
  right: 1,
  down: width,
  left: -1
}

class Player {
  constructor(client, color, snake, currDirection) {
    this.client = client
    this.currDirection = currDirection
    this.snake = snake
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

class Update {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
  }
}

const players = new Array();
const gameState = new GameState();

// For random spawn, this is pt 1 of 3.
// We also need to generate two additional spots adjacent, which are also valid
// Lastly, generate a direction which won't screw over the player (towards the center)
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

function findApples()
{
  for (let i = 0; i < gameState.board.length; i++)
  {
    for (let j = 0; j < gameState.board[i].length; j++)
    {
      if (gameState.board[i][j] == 'red')
      {
        updates.push(new Update(i, j, 'red'))
      }
    }
  }
}

function fillBoard()
{
  players.forEach((player) => {
    if (!player || player.state === 'dead') 
      return

    for (let i = 0; i < player.snake.length; i++)
    {
      gameState.board[Math.floor(player.snake[i] / width)][player.snake[i] % width] = player.color
      updates.push(new Update(Math.floor(player.snake[i] / width), player.snake[i] % width, player.color))
    }

    findApples()
    let newApple = findOpenPosition()
    gameState.board[newApple['x']][newApple['y']] = 'red'
    updates.push(new Update(newApple['x'], newApple['y'], 'red'))
  });
}

function removePlayer(player)
{
  for (let i = 0; i < player.snake.length; i++)
  {
    gameState.board[Math.floor( player.snake[i] / width)][player.snake[i] % width] = ''
    updates.push(new Update(Math.floor(player.snake[i] / width), player.snake[i] % width, ''))
  }

  player.snake = []
}

function moveOutcome(player) {
    if (checkForHits(player)) {
      player.state = 'dead';
      removePlayer(player)
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
  updates.push(new Update(Math.floor(tail / width), tail % width, ''))
  eatApple(player, tail);
  gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = player.color
  updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, player.color))
}

function checkForHits(player) {
  let dir = directions[player.currDirection]
  if (
    (player.snake[0] + width >= width * width && dir === width) ||
    (player.snake[0] % width === width - 1 && dir === 1) ||
    (player.snake[0] % width === 0 && dir === -1) ||
    (player.snake[0] - width <= 0 && dir === -width)
  ) {
    return true;
  }

  if ((gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] != 'red') && 
    (gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] != ''))
    {
      players.forEach(collision => {
        for (let i = 0; i < player.snake.length; i++)
        {
          if (gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] === collision.color
          && (player.snake[0] + dir) === collision.snake[i])
          {
            collision.score += 5
          }
        }
      });

      return true;
    }
    return false;
}

function eatApple(player, tail) {
  if (gameState.board[Math.floor(player.snake[0] / width)][(player.snake[0] % width)] == 'red') {
    gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = ''
    updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, ''))
    gameState.board[Math.floor(tail / width)][tail % width] = player.color
    updates.push(new Update(Math.floor(tail / width), tail % width, player.color))
    player.snake.push(tail);
    let newApple = findOpenPosition()
    gameState.board[newApple['x']][newApple['y']] = 'red'
    updates.push(new Update(newApple['x'], newApple['y'], 'red'))
    player.score++;
  }
}

function generatePlayer(client, color, size)
{
  let coords = findOpenPosition()
  let dir = coords['y'] > Math.floor(width / 2) ? 'left' : 'right'
  let snake = []
  if (dir == 'left')
  {
    for (let i = 0; i < size; i++)
      snake.push(coords['x'] * width + coords['y'] + i)
  }
  else {
    for (let i = 0; i < size; i++)
      snake.push(coords['x'] * width + coords['y'] - i)
  }
  console.log(snake)
  console.log(dir)
  return new Player(client, color, snake, dir)
}

let socket = new WebSocket.Server({ port: 8081 });

let i = 0;
socket.on("connection", (ws) => {
  let id = i++;
  // Create a new player object on connection
  ws.on("message", (data) => {
    let messageString = data.toString()
    if (messageString == 'quiz_success')
    {
      let existingPlayer = players[id]
      players[id] = generatePlayer(ws, existingPlayer.color, Math.max(3, existingPlayer.snake.length - 2))
    }
    else if (messageString != 'up' && messageString != 'down' && messageString != 'left' && messageString != 'right')
    {
      
      players.push(generatePlayer(ws, messageString, 3))
      fillBoard()
    }
    else
    {
      if (directions[data.toString()] != -directions[players[id].currDirection])
        players[id].currDirection = data.toString();
    }
    console.log("Message received: " + data.toString());
    
  })
  
  ws.on("close", () => {
    removePlayer(players[id])
    players[id] = null
    console.log("Player " + id + " has disconnected")
  })

})

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};

let interval = setInterval(() => {
  players.forEach((player) => {
    if (player && player.state === 'alive') {
      moveOutcome(player);
    }
  });

  players.forEach((player) => {
    if (player) {
    player.client.send(JSON.stringify({gameState: updates, playerState: player.state}));
    }
  });
  updates = []

}, 200);
