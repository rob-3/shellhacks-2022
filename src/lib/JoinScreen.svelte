<script>
  export let isFirstTime = false;

  let playerColor = null;
</script>

{#if !isFirstTime}
  <div class="absolute inset-0 bg-gray-900 text-white">
    <div class="flex h-full flex-col items-center justify-center">
      <div class="mb-6 text-4xl">Snake Battle Royale</div>
      <div class="flex flex-col">
        <input
          class="mb-3 rounded bg-gray-800 px-4 py-2"
          placeholder="Enter a name"
          type="text"
        />
        <button
          class=" rounded bg-green-500 px-4 py-2"
          on:click={() => (isFirstTime = true)}>Play</button
        >
      </div>
      <div class="mt-2">
        <label class="block" for="color">Choose your color</label>
        <input
          bind:value={playerColor}
          id="color"
          type="color"
          class="bg-gray-900"
        />
      </div>
    </div>
  </div>
{/if}
