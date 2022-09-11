import * as WebSocket from 'ws';

function sample<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const width: number = 50;
let updates: Update[] = [];

type LeaderboardEntry = {
  playerName: string;
  phoneNumber: string;
  isFinal: boolean;
  score: number;
}
const leaderboard: LeaderboardEntry[] = [];

const directions = {
  up: -width,
  right: 1,
  down: width,
  left: -1
};

function updateLeaderboard(player: Player) {
  let index = leaderboard.findIndex((winner => {return winner.playerName === player.name && !winner.isFinal}));
  const entry = leaderboard[index];
  if (entry && !entry.isFinal) {
    entry.score = player.score;
    while (index !== 0 && entry.score > leaderboard[index-1].score) {
      let temp = leaderboard[index-1];
      leaderboard[index-1] = entry;
      leaderboard[index] = temp;
      if (index === 5) {
        sendLeaderboardText(leaderboard[5]);
      }
      index--;
    }
  } else {
    leaderboard.push({ playerName: player.name, score: player.score, isFinal: false, phoneNumber: player.phoneNumber });
  }
}

type Direction = 'up' | 'down' | 'left' | 'right';

class Player {
  name: string;
  phoneNumber: string;
  state: 'alive' | 'dead';
  score: number;
  currDirection: Direction;
  color: string;
  snake: number[];
  client: WebSocket;
  constructor(
    client: WebSocket,
    color: string,
    snake: number[],
    currDirection: Direction,
    name: string,
    phoneNumber: string,
    score: number
  ) {
    this.client = client;
    this.currDirection = currDirection;
    this.snake = snake;
    this.color = color;
    this.score = score;
    this.state = 'alive';
    this.phoneNumber = phoneNumber;
    this.name = name;
  }
}

class GameState {
  board: string[][];
  constructor() {
    this.board = new Array(width).fill('').map(() => new Array(width).fill(''))
  }
}

class Update {
  x: number;
  y: number;
  color: string;
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

const players = new Array();
const gameState = new GameState();

function findOpenPosition() {
	const openSpots = [];
	for (let x = 0; x < gameState.board.length; x++) {
		for (let y = 0; y < gameState.board[x].length; y++) {
			if(gameState.board[x][y] === '') {
				openSpots.push({ x, y });
      }
		}
	}

	if (openSpots.length === 0) return null;
    
	return sample(openSpots);
}

function findApples() {
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[i].length; j++) {
      if (gameState.board[i][j] == 'red') {
        updates.push(new Update(i, j, 'red'));
      }
    }
  }
}

function fillBoard() {
  players.forEach((player) => {
    if (!player || player.state === 'dead') return;

    for (let i = 0; i < player.snake.length; i++) {
      gameState.board[Math.floor(player.snake[i] / width)][player.snake[i] % width] = player.color;
      updates.push(new Update(Math.floor(player.snake[i] / width), player.snake[i] % width, player.color));
    }

    findApples();
    let newApple = findOpenPosition();
    gameState.board[newApple['x']][newApple['y']] = 'red';
    updates.push(new Update(newApple['x'], newApple['y'], 'red'));
  });
}

function removePlayer(player: Player) {
  for (let i = 0; i < player.snake.length; i++) {
    gameState.board[Math.floor( player.snake[i] / width)][player.snake[i] % width] = '';
    updates.push(new Update(Math.floor(player.snake[i] / width), player.snake[i] % width, ''));
  }
  player.snake = [];
}

function moveOutcome(player: Player) {
  if (checkForHits(player)) {
    player.state = 'dead';
    removePlayer(player);
  } else {
    moveSnake(player);
  }
};

// The value at the head indicates index within game board
function moveSnake(player: Player) {
  const tail = player.snake.pop();
  // Remove tail from gameboard
  gameState.board[Math.floor(tail / width)][tail % width] = '';
  player.snake.unshift(player.snake[0] + directions[player.currDirection]);
  updates.push(new Update(Math.floor(tail / width), tail % width, ''));
  eatApple(player, tail);
  gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = player.color;
  updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, player.color));
}

function checkForHits(player: Player) {
  const dir = directions[player.currDirection]
  if (
    (player.snake[0] + width >= width * width && dir === width) ||
    (player.snake[0] % width === width - 1 && dir === 1) ||
    (player.snake[0] % width === 0 && dir === -1) ||
    (player.snake[0] - width <= 0 && dir === -width)
  ) {
    return true;
  }

  if ((gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] !== 'red') && 
    (gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] !== ''))
    {
      players.forEach(collision => {       
        for (let i = 0; i < player.snake.length; i++) {
          if (gameState.board[Math.floor((player.snake[0] + dir) / width)][(player.snake[0] + dir) % width] === collision?.color
          && (player.snake[0] + dir) === collision?.snake[i])
          {
            collision.score += 5;
            updateLeaderboard(collision);
          }
        }
      });

      return true;
    }
    return false;
}

function eatApple(player: Player, tail: number) {
  if (gameState.board[Math.floor(player.snake[0] / width)][(player.snake[0] % width)] == 'red') {
    gameState.board[Math.floor(player.snake[0] / width)][player.snake[0] % width] = '';
    updates.push(new Update(Math.floor(player.snake[0] / width), player.snake[0] % width, ''));
    gameState.board[Math.floor(tail / width)][tail % width] = player.color;
    updates.push(new Update(Math.floor(tail / width), tail % width, player.color));
    player.snake.push(tail);
    let newApple = findOpenPosition();
    gameState.board[newApple['x']][newApple['y']] = 'red';
    updates.push(new Update(newApple['x'], newApple['y'], 'red'));
    player.score++;
    updateLeaderboard(player);
  }
}

function generatePlayer(
  client: WebSocket,
  color: string,
  size: number,
  name: string,
  phoneNumber: string,
  score: number
) {
  const coords = findOpenPosition();
  const dir = coords['y'] > Math.floor(width / 2) ? 'left' : 'right';
  const snake = [];
  if (dir == 'left') {
    for (let i = 0; i < size; i++) {
      snake.push(coords['x'] * width + coords['y'] + i);
    }
  } else {
    for (let i = 0; i < size; i++) {
      snake.push(coords['x'] * width + coords['y'] - i);
    }
  }

  return new Player(client, color, snake, dir, name, phoneNumber, score);
}

function sendLeaderboardText(player: { phoneNumber: string }) {
  twilioClient.messages
    .create({
      body: "Somebody knocked you off the leaderboard! Looks like it's time to put your financial literacy skills to the test again!",
      from: "+19717913081",
      to: player.phoneNumber
    })
    .then((message: any) => console.log(message.sid));
}

const socket = new WebSocket.Server({ port: 8081 });

let i = 0;
socket.on("connection", (ws) => {
  console.log(`player ${i} has connected`);
  let id = i++;
  let player: Player;
  ws.on("message", (data) => {
    let messageString = data.toString();
    // Check with team on request structure
    if (messageString === 'quiz_success') {
      let existingPlayer = players[id];
      players[id] = generatePlayer(ws, existingPlayer.color, Math.max(3, existingPlayer.snake.length - 2), existingPlayer.name, existingPlayer.phoneNumber, existingPlayer.score);
      fillBoard();
    }
    // Check with team on request structure
    else if (messageString !== 'up' && messageString !== 'down' && messageString !== 'left' && messageString !== 'right') {
      player = JSON.parse(data.toString());
      players.push(generatePlayer(ws, player.color, 3, player.name, player.phoneNumber, 0));
      fillBoard();
    } else {
      if (directions[data.toString()] !== -directions[players[id].currDirection]) {
        players[id].currDirection = data.toString();
      }
    }
  });
  
  ws.on("close", () => {
    const entry = leaderboard.find(({ playerName, isFinal }) => playerName === player.name && !isFinal);
    entry.isFinal = true;
    removePlayer(players[id]);
    players[id] = null;
    console.log("Player " + id + " has disconnected");
  });
});

setInterval(() => {
  players.forEach((player) => {
    if (player && player.state === 'alive') {
      moveOutcome(player);
    }
  });

  players.forEach((player) => {
    const noPhoneLeaderboard = leaderboard.slice(0, 5).map(({ phoneNumber: _, ...entry }) => entry);
    if (player) {
      player.client.send(JSON.stringify({ gameState: updates, playerState: player.state, leaderboard: noPhoneLeaderboard }));
    }
  });
  updates = [];
}, 200);
