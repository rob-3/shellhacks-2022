<script lang="ts">
	import "./app.css";
	import Join from "./lib/JoinScreen.svelte";
	import Modal from "./lib/Modal.svelte";
	import UI from "./lib/UI.svelte";

	let isInGame = false;
	import { onMount } from "svelte";

	let board: boolean[][];
	let ctx: CanvasRenderingContext2D;
	let ws: WebSocket;

	const drawAt = (x: number, y: number): void => {
		ctx.fillRect(6 + x*25, 6 + y*25, 19, 19);
	}

	let heightInBlocks: number;
	let widthInBlocks: number;
	let clientHeight: number;
	let clientWidth: number;

	const renderBoard = (board: boolean[][]) => {
		ctx.clearRect(0, 0, clientWidth , clientHeight);
		for (let i = 0; i < widthInBlocks; i++) {
			for (let j = 0; j < heightInBlocks; j++) {
				if (board[i][j]) {
					drawAt(i, j);
				}
			}
		}
	}

	$: if (board) renderBoard(board);

	onMount(() => {
		({ clientHeight, clientWidth } = document.body);
		ws = new WebSocket('ws://www.website.com/path');
		ws.addEventListener('open', () => {
			console.log('socket open')
		});
		ws.addEventListener('message', (event) => {
			board = JSON.parse(event.data);
		})
		heightInBlocks = Math.floor((clientHeight - 6) / 25);
		widthInBlocks = Math.floor((clientWidth - 6) / 25);
		board = Array.from(Array(widthInBlocks), () => new Array(heightInBlocks));
		const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
		canvas.setAttribute("height", clientHeight.toString());
		canvas.setAttribute("width", clientWidth.toString());
		ctx = canvas.getContext('2d');
		board[0][0] = true;
		document.addEventListener("keydown", (event) => {
			console.log(event.key);
			switch (event.key) {
				case "ArrowUp":
				case "w":
					ws.send("up");
				break;
				case "ArrowDown":
				case "a":
					ws.send("down");
				break;
				case "ArrowRight":
				case "s":
				ws.send("right");
				break;
				case "ArrowLeft":
				case "d":
					ws.send("left");
				break;
			}
		});
	});
	let x = 0;
	setInterval(() => {
		x++;
		board = Array.from(Array(widthInBlocks), () => new Array(heightInBlocks));
		board[x][0] = true;
		console.log(board);
		}, 1000);
</script>

<canvas id="canvas" height="506" width="506"></canvas>

<UI />
<Modal />

<Join bind:isInGame />
