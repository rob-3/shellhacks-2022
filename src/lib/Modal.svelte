<script>
  export let isOpen = false;
</script>

{#if isOpen}
  <div class="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
  <div class="absolute inset-0 grid place-items-center">
    <div class=" rounded bg-gray-900 px-6 py-3 text-white">Hello</div>
  </div>
{/if}
