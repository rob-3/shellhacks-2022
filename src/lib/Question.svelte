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
  let handleAnswer = (target, answerChoice, answer) => {
    target.classList.remove("choice");
    if (answerChoice === answer) {
      target.classList.add("correct-choice");
      setTimeout(() => {
        dispatch("correct");
      }, 5000);
      return;
    }
    target.classList.add("wrong-choice");
    setTimeout(() => {
      question = generateQuestion();
      target.classList.remove("wrong-choice");
      target.classList.add("choice");
    }, 5000);
  };
</script>

<Modal>
  <div class="max-w-sm">
    <div class="text-2xl text-blue-200">Question</div>
    <div class="mb-10 text-4xl">{question.question}</div>
    <ul class="flex flex-col gap-2 overflow-auto">
      {#each question.answerChoices as answerChoice}
        <li
          class="choice"
          on:click={({ target }) => {
            handleAnswer(target, answerChoice, question.answer);
          }}
        >
          {answerChoice}
        </li>
      {/each}
    </ul>
  </div>
</Modal>

<style global>
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
