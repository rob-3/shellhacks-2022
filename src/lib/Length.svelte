<script lang="ts">
  export let playerScore: number;
  export let playerName: string;
</script>

<div class="fixed left-1 top-1">
  <div class="bg-gray-900 text-white px-6 py-3 rounded">
    <div class="font-bold">{playerName}</div>
    <div class="font-bold">{playerScore}</div>
  </div>
</div>
