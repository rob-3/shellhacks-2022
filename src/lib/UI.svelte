<script lang="ts">
  import Counter from "./Length.svelte";

  import ScoreBoard from "./Leaderboard.svelte";
  export let scoreboard;
  export let playerScore: number;
  export let playerName: string;
</script>

<ScoreBoard scoreboard={scoreboard}/>
<Counter playerScore={playerScore} playerName={playerName}/>
<slot />
