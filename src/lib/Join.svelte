<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  let playerColor = "#000000";
  let playerName = "";
  let phoneNumber = "";
  let isTouched = false;

  const dispatch = createEventDispatcher();

  let input: HTMLInputElement = null;

  const handleJoin = () => {
    if (playerName.length < 1) {
      input.classList.remove("border-gray-800");
      input.classList.add("ring-red-500");
      input.classList.add("border-red-500");
      return;
    }
    dispatch("close", {
      playerName,
      playerColor,
      phoneNumber,
    });
  };

  const removeErrorStyles = ({ target }) => {
    if (target.classList.contains("ring-red-500")) {
      target.classList.remove("ring-red-500");
      target.classList.remove("border-red-500");
      target.classList.add("border-gray-800");
    }
  };
</script>

<div transition:fade class="fixed inset-0 bg-gray-900 text-white">
  <div class="flex h-full flex-col items-center justify-center">
    <div class="mb-6 text-center text-4xl">
      Finance<span class="text-5xl text-green-400">Viper</span>
    </div>
    <form on:submit|preventDefault={handleJoin} class="mb-4 flex flex-col">
      <input
        bind:this={input}
        on:input={removeErrorStyles}
        on:blur={() => (isTouched = true)}
        class="mb-3 rounded border bg-gray-800 px-4 py-2 {isTouched &&
        playerName.length < 1
          ? 'border-red-500 ring-red-500'
          : 'border-gray-800'}"
        placeholder="Nickname"
        type="text"
        bind:value={playerName}
      />
      <input
        class="mb-3 rounded border border-gray-800 bg-gray-800 px-4 py-2"
        placeholder="Phone number (optional)"
        type="text"
        bind:value={phoneNumber}
      />
      <button class=" rounded bg-green-400 px-4 py-2">Play</button>
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
