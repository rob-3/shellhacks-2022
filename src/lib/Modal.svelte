<script lang="ts">
  import { fade, fly } from "svelte/transition";

  export let isOpen: Boolean;
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"
  />
  <div
    transition:fly={{ duration: 150, y: 100 }}
    class="fixed inset-0 grid place-items-center"
  >
    <div class="rounded-xl bg-gray-900 p-8 text-white">
      <div class="text-2xl text-blue-200">Question</div>
      <div class="text-4xl mb-10">What is a loan?</div>
      <ul class="flex flex-col gap-2 max-w-400px">
        <li class="choice">
          <div>A. Answer 1</div>
        </li>
        <li class="wrong-choice">
          <div>B. Answer 2</div>
        </li>
        <li class="correct-choice">
          <div>C. Answer 3</div>
        </li>
      </ul>
    </div>
  </div>
{/if}

<style>
  .choice {
    @apply flex justify-between items-center px-5 py-3 bg-gray-800  transition rounded-xl cursor-pointer;
  }

  .choice:hover {
    @apply bg-gray-700;
  }

  .correct-choice {
    @apply flex justify-between items-center px-5 py-3 bg-green-400 rounded-xl;
  }

  .wrong-choice {
    @apply flex justify-between items-center px-5 py-3 bg-red-400 rounded-xl;
  }
</style>
