<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'proceed'): void
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
    emit('proceed')

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

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false

  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable
}

onKeyStroke(' ', (event) => {
  if (event.repeat || isFormField(event.target))
    return

  event.preventDefault()
  game.pauseGame()
})

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
  <GameStateLayout
    :content-key="`${currentQuestion.cca3}-question`"
  >
    <template #content>
      <div class="h-48 lg:h-80 flex flex-col">
        <GameImage
          :key="currentQuestion.cca3"
          :src="currentQuestion.flag.svg"
          :alt="currentQuestion.flag.alt"
        />

        <p v-if="currentQuestion.hint" class="shrink-0 text-muted mt-4">
          Hint: {{ currentQuestion.hint }}
        </p>
      </div>
    </template>

    <template #actions>
      <GamePlayTypeAnswer
        v-if="config.game.mode === 'type-answer'"
        :key="`typed-${currentQuestion.cca3}`"
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
