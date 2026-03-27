<script setup lang="ts">
interface FlagQuizGameProps {
  questions: Country[]
}

const props = defineProps<FlagQuizGameProps>()

const emit = defineEmits<{
  back: []
}>()

const isPaused = ref(false)
const selectedChoiceCode = ref<string | null>(null)
const isRevealed = ref(false)
const elapsedSeconds = ref(0)

const CHOICE_COUNT = 4
const ADVANCE_DELAY_MS = 600

const currentIndex = ref(0)
let advanceTimeout: ReturnType<typeof setTimeout> | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null

const totalQuestions = computed(() => {
  return props.questions.length
})

const currentQuestionNumber = computed(() => {
  if (totalQuestions.value === 0) {
    return 0
  }

  return Math.min(currentIndex.value + 1, totalQuestions.value)
})

const currentQuestion = computed(() => {
  return props.questions[currentIndex.value] ?? null
})

const nextQuestion = computed(() => {
  return props.questions[currentIndex.value + 1] ?? null
})

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = current
  }

  return shuffled
}

const choices = computed(() => {
  if (!currentQuestion.value) {
    return [] as Country[]
  }

  const correct = currentQuestion.value
  const distractors = shuffle(props.questions.filter(country => country.cca2 !== correct.cca2)).slice(0, CHOICE_COUNT - 1)

  return shuffle([correct, ...distractors]).slice(0, CHOICE_COUNT)
})

function clearTimerInterval(): void {
  if (!timerInterval) {
    return
  }

  clearInterval(timerInterval)
  timerInterval = null
}

function startTimerInterval(): void {
  if (timerInterval || isPaused.value || !currentQuestion.value) {
    return
  }

  timerInterval = setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)
}

function clearAdvanceTimeout(): void {
  if (!advanceTimeout) {
    return
  }

  clearTimeout(advanceTimeout)
  advanceTimeout = null
}

function resetChoiceState(): void {
  selectedChoiceCode.value = null
  isRevealed.value = false
}

function isSelectedChoice(choice: Country): boolean {
  return selectedChoiceCode.value === choice.cca2
}

function isCorrectChoice(choice: Country): boolean {
  return currentQuestion.value?.cca2 === choice.cca2
}

function showSuccessOverlay(choice: Country): boolean {
  return isRevealed.value && isSelectedChoice(choice) && isCorrectChoice(choice)
}

function showErrorOverlay(choice: Country): boolean {
  return isRevealed.value && isSelectedChoice(choice) && !isCorrectChoice(choice)
}

function handleChoiceSelect(choice: Country): void {
  if (!currentQuestion.value || isPaused.value || isRevealed.value) {
    return
  }

  selectedChoiceCode.value = choice.cca2
  isRevealed.value = true

  clearAdvanceTimeout()
  advanceTimeout = setTimeout(() => {
    currentIndex.value += 1
    resetChoiceState()
    advanceTimeout = null
  }, ADVANCE_DELAY_MS)
}

function handleResume(): void {
  isPaused.value = false
}

function handleExit(): void {
  clearAdvanceTimeout()
  clearTimerInterval()
  resetChoiceState()
  isPaused.value = false
  emit('back')
}

watch([isPaused, currentQuestion], ([paused, question]) => {
  if (paused || !question) {
    clearTimerInterval()
    return
  }

  startTimerInterval()
}, { immediate: true })

onBeforeUnmount(() => {
  clearAdvanceTimeout()
  clearTimerInterval()
})

// FIXME: Alt text shown when img not loaded
// FIXME: Hint for territories that have the same flag as country
// FIXME: Alt text of images shouldn't have the name of the country in it
// FIXME: Cards need to have a slight off-white background in light mode
// TODO: Stop timer at 60m
</script>

<template>
  <section class="space-y-12">
    <GameHeader
      v-model:paused="isPaused"
      :current-question-number="currentQuestionNumber"
      :total-questions="totalQuestions"
      :elapsed-seconds="elapsedSeconds"
    />

    <Transition name="fade" mode="out-in">
      <GamePause
        v-if="isPaused"
        key="paused"
        @resume="handleResume"
        @exit="handleExit"
      />

      <div
        v-else-if="currentQuestion"
        key="playing"
        class="space-y-12"
      >
        <Transition name="fade" mode="out-in" appear>
          <div :key="currentQuestion.cca2" class="grid grid-cols-2 items-stretch gap-4 max-w-2xl mx-auto">
            <GameImage
              class="col-span-2"
              :src="currentQuestion.flag.svg"
              :alt="currentQuestion.flag.alt"
              :preload-src="nextQuestion?.flag.svg"
            />

            <div
              v-for="choice in choices"
              :key="choice.cca2"
              class="relative"
              :class="{
                'choice-wiggle': showErrorOverlay(choice),
                'choice-pop': showSuccessOverlay(choice),
              }"
            >
              <BaseCardButton
                :label="choice.name.common"
                :disabled="isRevealed"
                @click="handleChoiceSelect(choice)"
              />

              <Transition name="fade">
                <div
                  v-if="showSuccessOverlay(choice)"
                  class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-success text-inverted pointer-events-none"
                >
                  <UIcon name="i-tabler-check" class="size-10" />
                </div>

                <div
                  v-else-if="showErrorOverlay(choice)"
                  class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-error text-inverted pointer-events-none"
                >
                  <UIcon name="i-tabler-x" class="size-10" />
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>

      <div
        v-else
        key="empty"
        class="py-6 text-center text-sm text-muted"
      >
        No questions available for this game.
      </div>
    </Transition>
  </section>
</template>

<style scoped>
@keyframes choice-wiggle {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-6px);
  }
  40%,
  80% {
    transform: translateX(6px);
  }
}

.choice-pop {
  animation: choice-pop 400ms ease-out 1;
}

@keyframes choice-pop {
  0% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(-10px);
  }
  65% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-3px);
  }
}

.choice-wiggle {
  animation: choice-wiggle 400ms ease-in-out 1;
}

@media (prefers-reduced-motion: reduce) {
  .choice-pop {
    animation: none;
  }

  .choice-wiggle {
    animation: none;
  }
}
</style>
