<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  let playerColor = "#000000";
  let playerName = "";
  let phoneNumber = ""

  const dispatch = createEventDispatcher();

  const handleJoin = () => {
    if (playerName.length < 1) {
      return;
    }
    dispatch("close", {
      playerName,
      playerColor,
      phoneNumber,
    });
  };
</script>

<div transition:fade class="fixed inset-0 bg-gray-900 text-white">
  <div class="flex h-full flex-col items-center justify-center">
    <div class="mb-6 text-center text-4xl">Snake Battle Royale</div>
    <form on:submit|preventDefault={handleJoin} class="mb-4 flex flex-col">
      <input
        class="mb-3 rounded border border-gray-800 bg-gray-800 px-4 py-2"
        placeholder="Enter a name"
        type="text"
        bind:value={playerName}
      />
      <input
        class="mb-3 rounded border border-gray-800 bg-gray-800 px-4 py-2"
        placeholder="phone number (optional)"
        type="text"
        bind:value={phoneNumber}
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
