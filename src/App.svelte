<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import "./app.css";
  import Death from "./lib/Death.svelte";
  import Join from "./lib/Join.svelte";
  import Question from "./lib/Question.svelte";
  import UI from "./lib/UI.svelte";

  let board: string[][];
  let ctx: CanvasRenderingContext2D;
  let ws: WebSocket;
  let clientHeight: number;
  let clientWidth: number;
  let isDead = false;
  let isJoining = true;
  let isAnsweringQuestion = false;
  let pixelsPerBlock: number;
  let paddingPerBlock: number;
  let drawablePixelsPerBlock: number;

  const drawAt = (color: string, x: number, y: number): void => {
    ctx.fillStyle = color;
    ctx.fillRect(
      paddingPerBlock + x * pixelsPerBlock,
      paddingPerBlock + y * pixelsPerBlock,
      drawablePixelsPerBlock,
      drawablePixelsPerBlock
    );
  };

  const renderBoard = (board: string[][]) => {
    ctx.clearRect(0, 0, clientWidth, clientHeight);
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
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
    ws = new WebSocket("ws://localhost:8081");
    ws.addEventListener("open", () => {
      console.log("socket open");
      ws.send(event.detail.playerColor);
      isJoining = false;
    });
    ws.addEventListener("message", (event) => {
      console.log(event.data);
      const { gameState, playerState } = JSON.parse(event.data);
      for (const { x, y, color } of gameState) {
        board[x][y] = color;
      }

      if (playerState === "dead") {
        isDead = true;
      }
    });
  };

  onMount(() => {
    ({ clientHeight, clientWidth } = document.documentElement);
    clientHeight -= 40;
    clientWidth -= 40;
    board = Array.from(Array(50), () => new Array(50));
    clientHeight = clientWidth = Math.min(clientWidth, clientHeight);
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
    canvas.setAttribute("height", clientHeight.toString());
    canvas.setAttribute("width", clientWidth.toString());
    pixelsPerBlock = Math.floor(clientHeight / 50);
    paddingPerBlock = Math.floor(pixelsPerBlock / 4);
    drawablePixelsPerBlock = pixelsPerBlock - paddingPerBlock;
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (isDead) return;
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

<div class="m-4 grid place-items-center">
  <canvas class="border border-red-500" id="canvas" height="850" width="850" />
</div>

<UI />

{#if isDead}
  <Death
    on:close={() => {
      isAnsweringQuestion = true;
      isDead = false;
    }}
  />
{/if}

{#if isAnsweringQuestion}
  <Question
    on:correct={() => {
      ws.send("quiz_success");
      isDead = false;
      isAnsweringQuestion = false;
    }}
  />
{/if}

{#if isJoining}
  <Join on:close={onLogin} />
{/if}
