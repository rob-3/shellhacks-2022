<script>
  import { createEventDispatcher, onMount } from "svelte";

  import Modal from "./Modal.svelte";

  onMount(() => {
    setTimeout(() => {
      dispatch("close");
    }, 3000);
  });
  let dispatch = createEventDispatcher();
</script>

<Modal>
  <div class="text-center">
    <div class="mb-8 text-7xl">💀</div>
    <div class="mb-4 text-3xl">Oh no you died!</div>
    <div class="mb-6 max-w-sm">
      You're going to have to answer this financial literacy question to come
      back to life!
    </div>
  </div>
</Modal>
