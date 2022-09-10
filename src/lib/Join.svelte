<script>
  import { createEventDispatcher } from "svelte";

  let playerColor = "#000000";
  let playerName = "";

  const dispatch = createEventDispatcher();

  //Convert Hex to RGB
  function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  const handleJoin = () => {
    if (playerName.length < 1) {
      return;
    }
    dispatch("close", {
      playerName,
      playerColor,
    });
  };
</script>

<div class="fixed inset-0 bg-gray-900 text-white">
  <div class="flex h-full flex-col items-center justify-center">
    <div class="mb-6 text-center text-4xl">Snake Battle Royale</div>
    <form on:submit|preventDefault={handleJoin} class="mb-4 flex flex-col">
      <input
        class="mb-3 rounded border border-gray-800 bg-gray-800 px-4 py-2"
        placeholder="Enter a name"
        type="text"
        bind:value={playerName}
      />
      <button class=" rounded bg-green-500 px-4 py-2">Play</button>
    </form>
    <div>
      <label class="mb-1 block" for="color">Choose your color</label>
      <input
        bind:value={playerColor}
        id="color"
        type="color"
        class="mx-auto flex cursor-pointer bg-gray-900"
      />
    </div>
  </div>
</div>

<style>
  input:focus,
  button:focus {
    @apply rounded outline-none ring-2 ring-offset-2 ring-offset-gray-900;
  }

  input[type="color"] {
    @apply h-10 w-10;
  }
</style>
