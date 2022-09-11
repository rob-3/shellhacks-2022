<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import questions from "../questions.json";
  import Modal from "./Modal.svelte";

  let dispatch = createEventDispatcher();

  let generateQuestion = () => {
    let question = questions[Math.floor(Math.random() * questions.length)];
    return question;
  };

  let answerIsChosen = false;

  let question = generateQuestion();
  let handleAnswer = (target, answerChoice, answer) => {
    if (answerIsChosen) {
      return;
    }
    target.classList.remove("choice");
    if (answerChoice === answer) {
      target.classList.add("correct-choice");
      setTimeout(() => {
        dispatch("correct");
      }, 3000);
    } else {
      target.classList.add("wrong-choice");
      setTimeout(() => {
        question = generateQuestion();
        target.classList.remove("wrong-choice");
        target.classList.add("choice");
        answerIsChosen = false;
      }, 3000);
    }
    answerIsChosen = true;
  };
</script>

<Modal>
  <div class="max-w-sm">
    <div class="text-xl text-blue-200">Question</div>
    <div class="mb-10 text-2xl">{question.question}</div>
    <ul class="flex flex-col gap-2 overflow-visible">
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
    @apply flex cursor-pointer items-center justify-between rounded-xl bg-gray-800 px-5 py-3 transition;
  }

  .choice:hover {
    @apply scale-105  bg-gray-700;
  }

  .correct-choice {
    @apply flex scale-105 animate-bounce items-center justify-between rounded-xl bg-green-400 px-5 py-3;
    animation: bounce 2s cubic-bezier(0.28, 0.84, 0.42, 1);
  }

  .wrong-choice {
    @apply flex scale-105 items-center justify-between rounded-xl bg-red-400 px-5 py-3;
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  @keyframes bounce {
    0% {
      transform: scale(1.05) translateY(0);
    }
    10% {
      transform: scale(1.05) translateY(0);
    }
    30% {
      transform: scale(1.05) translateY(-15px);
    }
    50% {
      transform: scale(1.05) translateY(0);
    }
    57% {
      transform: scale(1.05) translateY(0);
    }
    64% {
      transform: scale(1.05) translateY(0);
    }
    100% {
      transform: scale(1.05) translateY(0);
    }
  }

  @keyframes shake {
    10%,
    90% {
      transform: scale(1.025, 1.025) translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: scale(1.025, 1.025) translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: scale(1.025, 1.025) translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: scale(1.025, 1.025) translate3d(4px, 0, 0);
    }
  }
</style>
