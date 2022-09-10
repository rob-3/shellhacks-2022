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
		for (let i = 0; i < 100; i++) {
			for (let j = 0; j < 100; j++) {
				if (board[j][i]) {
					drawAt(i, j);
				}
			}
		}
	}

	$: if (board) renderBoard(board);

	onMount(() => {
		({ clientHeight, clientWidth } = document.body);
		ws = new WebSocket('ws://localhost:8081');
		ws.addEventListener('open', () => {
			console.log('socket open')
		});
		ws.addEventListener('message', (event) => {
			console.log(event.data);
			const { board: newBoardState, playerState } = JSON.parse(event.data);
			board = newBoardState;
		})
		heightInBlocks = Math.floor((clientHeight - 6) / 25);
		widthInBlocks = Math.floor((clientWidth - 6) / 25);
		board = Array.from(Array(100), () => new Array(100));
		const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
		canvas.setAttribute("height", clientHeight.toString());
		canvas.setAttribute("width", clientWidth.toString());
		ctx = canvas.getContext('2d');
		document.addEventListener("keydown", (event) => {
			console.log(event.key);
			switch (event.key) {
				case "ArrowUp":
				case "w":
					ws.send("up");
				break;
				case "ArrowDown":
				case "s":
					ws.send("down");
				break;
				case "ArrowRight":
				case "d":
				ws.send("right");
				break;
				case "ArrowLeft":
				case "a":
					ws.send("left");
				break;
			}
		});
	});
</script>

<canvas id="canvas" height="506" width="506"></canvas>

<UI />
<Modal />

<Join bind:isInGame />
