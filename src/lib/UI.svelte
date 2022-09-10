<script>
  import Counter from "./Length.svelte";

  import ScoreBoard from "./Leaderboard.svelte";
  export let scoreboard;
</script>

<ScoreBoard scoreboard={scoreboard}/>
<Counter />
<slot />
