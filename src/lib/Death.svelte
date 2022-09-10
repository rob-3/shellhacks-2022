<script>
  import { createEventDispatcher } from "svelte";

  import Modal from "./Modal.svelte";

  let dispatch = createEventDispatcher();
</script>

<Modal>
  <div class="text-center">
    <div class="text-7xl mb-8">😭</div>
    <div class="text-3xl mb-4">Oh no you died!</div>
    <div class="mb-6 max-w-sm">
      Please answer the following financial literacy question
    </div>
    <button
      class="bg-gray-800 px-4 py-2 rounded"
      on:click={() => dispatch("showquestion")}>See Question</button
    >
  </div>
</Modal>
