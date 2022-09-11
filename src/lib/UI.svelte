<script lang="ts">
  import Counter from "./Length.svelte";

  import ScoreBoard from "./Leaderboard.svelte";
  export let scoreboard;
  export let playerName: string;
  export let playerLength: number;
</script>

<ScoreBoard scoreboard={scoreboard}/>
<Counter playerName={playerName} playerLength={playerLength}/>
<slot />
