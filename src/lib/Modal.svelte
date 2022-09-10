<script lang="ts">
  import { fade, fly } from "svelte/transition";
</script>

<div
  transition:fade={{ duration: 300 }}
  class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"
/>
<div
  transition:fly={{ duration: 300, y: 150 }}
  class="fixed inset-0 grid place-items-center"
>
  <div class="rounded-xl bg-gray-900 p-8 text-white">
    <slot />
  </div>
</div>
