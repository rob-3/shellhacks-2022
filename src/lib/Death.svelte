<script>
  import { createEventDispatcher } from "svelte";

  import Modal from "./Modal.svelte";

  let dispatch = createEventDispatcher();
</script>

<Modal>
  <div class="text-center">
    <div class="mb-8 text-7xl">💀</div>
    <div class="mb-4 text-3xl">Oh no you died!</div>
    <div class="mb-6 max-w-sm">
      Please answer the following financial literacy question
    </div>
    <button
      class="rounded bg-gray-800 px-4 py-2"
      on:click={() => dispatch("close")}>See Question</button
    >
  </div>
</Modal>
