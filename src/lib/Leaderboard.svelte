<script>
  export let scoreboard = [];
</script>

<div
  id="leaderboard"
  class="fixed top-4 right-4 rounded bg-gray-900 px-6 py-3 text-white opacity-95"
>
  <div class="mb-1 text-xl">Leaderboard</div>
  <table class="w-[250px] table-auto">
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-right">Score</th>
      </tr>
    </thead>
    <tbody>
      {#each scoreboard as { playerName, score }}
        <tr>
          <td>{playerName}</td>
          <td class="text-right">{score}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
