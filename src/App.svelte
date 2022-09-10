<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import "./app.css";
  import Join from "./lib/JoinScreen.svelte";
  import UI from "./lib/UI.svelte";

  let board: string[][];
  let ctx: CanvasRenderingContext2D;
  let ws: WebSocket;

  const drawAt = (color: string, x: number, y: number): void => {
    ctx.fillStyle = color;
    ctx.fillRect(6 + x * 25, 6 + y * 25, 19, 19);
  };

  let heightInBlocks: number;
  let widthInBlocks: number;
  let clientHeight: number;
  let clientWidth: number;
  let playerIsDead = false;
	let showLogin = true;

  const renderBoard = (board: string[][]) => {
    ctx.clearRect(0, 0, clientWidth, clientHeight);
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        if (board[j][i]) {
          drawAt(board[j][i], i, j);
        }
      }
    }
  };

  $: if (board) renderBoard(board);

  const onLogin = (event) => {
    console.log(event);
    console.log("opening socket");
    ws = new WebSocket("ws://20.106.75.32:8081");
    ws.addEventListener("open", () => {
      console.log("socket open");
      ws.send(event.detail.playerColor);
      showLogin = false;
    });
    ws.addEventListener("message", (event) => {
      console.log(event.data);
      const { gameState, playerState } = JSON.parse(event.data);
      for (const { x, y, color } of gameState) {
        board[x][y] = color;
      }

      if (playerState === "dead") {
        playerIsDead = true;
      }
    });
  };

  onMount(() => {
    ({ clientHeight, clientWidth } = document.body);
    heightInBlocks = Math.floor((clientHeight - 6) / 25);
    widthInBlocks = Math.floor((clientWidth - 6) / 25);
    board = Array.from(Array(100), () => new Array(100));
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
    canvas.setAttribute("height", clientHeight.toString());
    canvas.setAttribute("width", clientWidth.toString());
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (playerIsDead) return;
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

  onDestroy(() => {
    console.log("goodbye!");
    ws.close();
  });
</script>

<canvas id="canvas" height="506" width="506" />

<UI />

{#if showLogin}
  <Join on:close={onLogin} />
{/if}
