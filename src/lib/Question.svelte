<script>
  import questions from "../questions.json";
  import Modal from "./Modal.svelte";

  let question = questions[Math.floor(Math.random() * questions.length)];
</script>

<Modal>
  <div class="text-2xl text-blue-200">Question</div>
  <div class="mb-10 text-4xl">{question.question}</div>
  <ul class="max-w-400px flex flex-col gap-2">
    {#each question.answerChoices as answerChoice}
      <li class="choice">{answerChoice}</li>
    {/each}
  </ul>
</Modal>

<style>
  .choice {
    @apply flex cursor-pointer items-center justify-between rounded-xl bg-gray-800  px-5 py-3 transition;
  }

  .choice:hover {
    @apply bg-gray-700;
  }

  .correct-choice {
    @apply flex items-center justify-between rounded-xl bg-green-400 px-5 py-3;
  }

  .wrong-choice {
    @apply flex items-center justify-between rounded-xl bg-red-400 px-5 py-3;
  }
</style>
