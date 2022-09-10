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

  const drawAt = (color: string, x: number, y: number): void => {
    ctx.fillStyle = color;
    ctx.fillRect(6 + x * 25, 6 + y * 25, 19, 19);
  };

  let clientHeight: number;
  let clientWidth: number;
  let isDead = false;
  let isJoining = false;
  let isAnsweringQuestion = false;

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
      isJoining = false;
    });
    ws.addEventListener("message", (event) => {
      console.log(event.data);
      const { gameState, playerState } = JSON.parse(event.data);
      board = gameState.board;

      if (playerState === "dead") {
        isDead = true;
      }
    });
  };

  onMount(() => {
    ({ clientHeight, clientWidth } = document.body);
    board = Array.from(Array(100), () => new Array(100));
    const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
    canvas.setAttribute("height", clientHeight.toString());
    canvas.setAttribute("width", clientWidth.toString());
    ctx = canvas.getContext("2d");
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

  onDestroy(() => {
    console.log("goodbye!");
    ws.close();
  });
</script>

<canvas id="canvas" height="506" width="506" />
<UI />

{#if isDead}
  <Death
    on:showquestion={() => {
      isAnsweringQuestion = true;
      isDead = false;
    }}
  />
{/if}

{#if isAnsweringQuestion}
  <Question />
{/if}

{#if isJoining}
  <Join on:close={onLogin} />
{/if}
