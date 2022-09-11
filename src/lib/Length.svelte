<script lang="ts">
  export let playerLength: number;
  export let playerName: string;
</script>

<div class="fixed left-4 top-4 opacity-95">
  <div class="rounded bg-gray-900 px-6 py-3 text-white">
    <div class="text-xl font-bold">Name: {playerName}</div>
    <div class="text-lg">Length: {playerLength}</div>
  </div>
</div>
