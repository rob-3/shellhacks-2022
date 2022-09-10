<script>
  import "./app.css";
  import Join from "./lib/JoinScreen.svelte";
  import Modal from "./lib/Modal.svelte";
  import UI from "./lib/UI.svelte";

  let isInGame = false;
</script>

<UI />
<Modal />

<Join bind:isInGame />
