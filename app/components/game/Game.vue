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

const CHOICE_COUNT = 4
const ADVANCE_DELAY_MS = 600

const currentIndex = ref(0)
let advanceTimeout: ReturnType<typeof setTimeout> | null = null

const currentQuestion = computed(() => {
  return props.questions[currentIndex.value] ?? null
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
  resetChoiceState()
  isPaused.value = false
  emit('back')
}

onBeforeUnmount(() => {
  clearAdvanceTimeout()
})

// FIXME: Alt text shown when img not loaded
// FIXME: Hint for territories that have the same flag as country
</script>

<template>
  <section class="space-y-12">
    <GameHeader v-model:paused="isPaused" />

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
          <div :key="currentQuestion.cca2" class="space-y-12">
            <img
              :src="currentQuestion.flag.svg"
              :alt="currentQuestion.flag.alt"
              class="mx-auto h-56 w-full object-contain lg:h-72"
            >

            <div class="mx-auto grid max-w-2xl grid-cols-2 items-stretch gap-4">
              <div
                v-for="choice in choices"
                :key="choice.cca2"
                class="relative"
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
