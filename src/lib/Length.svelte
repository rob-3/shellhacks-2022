<script lang="ts">
  export let playerScore: number;
  export let playerName: string;
</script>

<div class="fixed left-4 top-4 opacity-95">
  <div class="rounded bg-gray-900 px-6 py-3 text-white">
    <div class="font-bold">{playerName}</div>
    <div class="font-bold">{playerScore}</div>
  </div>
</div>
