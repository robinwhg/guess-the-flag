<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const ANSWER_FEEDBACK_DELAY = 600
const currentQuestion = computed(() => game.currentQuestion.value!)
const typedAnswer = ref('')
const feedback = ref<'none' | 'success' | 'error'>('none')
const isSubmitting = ref(false)
const proceedTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

function clearProceedTimeout() {
  if (!proceedTimeout.value)
    return

  clearTimeout(proceedTimeout.value)
  proceedTimeout.value = null
}

function scheduleProceedToNextQuestion() {
  clearProceedTimeout()

  proceedTimeout.value = setTimeout(() => {
    proceedTimeout.value = null
    game.proceedToNextQuestion()
    feedback.value = 'none'
    isSubmitting.value = false
  }, ANSWER_FEEDBACK_DELAY)
}

function onSubmitTypedAnswer() {
  if (isSubmitting.value)
    return

  const isCorrect = game.submitTypedAnswer(typedAnswer.value)

  if (isCorrect === null)
    return

  isSubmitting.value = true
  feedback.value = isCorrect ? 'success' : 'error'
  scheduleProceedToNextQuestion()
}

function onSelectChoice(choice: GameChoice) {
  if (isSubmitting.value)
    return

  const isCorrect = game.submitSelectedChoice(choice)

  if (isCorrect === null)
    return

  isSubmitting.value = true
  feedback.value = isCorrect ? 'success' : 'error'
  scheduleProceedToNextQuestion()
}

onScopeDispose(() => {
  clearProceedTimeout()
})

watch(() => currentQuestion.value.cca3, () => {
  typedAnswer.value = ''
  feedback.value = 'none'
  isSubmitting.value = false
})
</script>

<template>
  <GameStateLayout :content-key="currentQuestion.cca3">
    <template #content>
      <div class="flex h-full flex-col gap-1">
        <GameImage
          :key="currentQuestion.cca3"
          :src="currentQuestion.flag.svg"
          :alt="currentQuestion.flag.alt"
          class="min-h-0"
        />

        <p v-if="currentQuestion.hint" class="text-muted">
          Hint: {{ currentQuestion.hint }}
        </p>
      </div>
    </template>

    <template #actions>
      <GamePlayTypeAnswer
        v-if="config.game.mode === 'type-answer'"
        v-model="typedAnswer"
        :feedback
        :disabled="isSubmitting"
        @submit="onSubmitTypedAnswer"
      />

      <GamePlayMultipleChoice
        v-else
        :key="`choices-${currentQuestion.cca3}`"
        :choices="game.choices.value"
        :feedback
        :disabled="isSubmitting"
        @select="onSelectChoice"
      />
    </template>
  </GameStateLayout>
</template>
