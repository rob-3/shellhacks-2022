<script>
  import { createEventDispatcher } from "svelte";
  import questions from "../questions.json";
  import Modal from "./Modal.svelte";

  let dispatch = createEventDispatcher();

  let generateQuestion = () => {
    let question = questions[Math.floor(Math.random() * questions.length)];
    return question;
  };

  let question = generateQuestion();
  let checkAnswer = (answerChoice, answer) => {
    if (answerChoice === answer) {
      dispatch("correct");
      return;
    }
    question = generateQuestion();
  };
</script>

<Modal>
  <div class="text-2xl text-blue-200">Question</div>
  <div class="mb-10 text-4xl">{question.question}</div>
  <ul class="max-w-400px flex flex-col gap-2">
    {#each question.answerChoices as answerChoice}
      <li
        class="choice"
        on:click={() => checkAnswer(answerChoice, question.answer)}
      >
        {answerChoice}
      </li>
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
