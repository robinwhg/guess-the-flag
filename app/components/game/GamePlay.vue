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
      <UInput
        v-if="config.game.mode === 'type-answer'"
        v-model="typedAnswer"
        size="xl"
        variant="soft"
        placeholder="Enter your answer here..."
        class="w-full"
        :class="{
          'choice-pop': feedback === 'success',
          'choice-wiggle': feedback === 'error',
        }"
        :ui="{ base:
          feedback === 'success' ? 'text-success bg-success/25 hover:bg-success/25 focus:bg-success/25 disabled:bg-success/25 px-4 py-4'
          : feedback === 'error' ? 'text-error bg-error/25 hover:bg-error/25 focus:bg-error/25 disabled:bg-error/25 px-4 py-4'
            : 'px-4 py-4',
        }"
        @keyup.enter="onSubmitTypedAnswer"
      >
        <template #trailing>
          <UButton
            :disabled="!typedAnswer.length || isSubmitting"
            color="neutral"
            variant="link"
            icon="i-tabler-arrow-forward"
            aria-label="Clear input"
            :ui="{ leadingIcon:
              feedback === 'success' ? 'text-success'
              : feedback === 'error' ? 'text-error'
                : '',
            }"
            @click="onSubmitTypedAnswer"
          />
        </template>
      </UInput>

      <div v-else :key="`choices-${currentQuestion.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
        <div
          v-for="choice in game.choices.value" :key="choice.country.cca3" class="relative"
          :class="{
            'choice-pop': feedback === 'success' && choice.selected,
            'choice-wiggle': feedback === 'error' && choice.selected,
          }"
        >
          <BaseCardButton
            :disabled="isSubmitting"
            :label="choice.country.name.common"
            @click="onSelectChoice(choice)"
          />

          <Transition name="fade" mode="out-in">
            <div
              v-if="feedback !== 'none' && choice.selected"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
              :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
            >
              <UIcon
                class="size-10"
                :name="
                  feedback === 'success' ? 'i-tabler-check'
                  : feedback === 'error' ? 'i-tabler-x'
                    : ''
                "
              />
            </div>
          </Transition>
        </div>
      </div>
    </template>
  </GameStateLayout>
</template>
