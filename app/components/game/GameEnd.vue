<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const hasWrongAnswers = computed(() => game.totalCorrectQuestions.value < game.totalQuestions.value)

const accuracyPct = computed(() => calculateAccuracy(game.totalCorrectQuestions.value, game.totalQuestions.value))

onKeyStroke('Enter', (event) => {
  if (event.repeat)
    return

  emit('back')
})

onKeyStroke('Backspace', (event) => {
  if (event.repeat)
    return

  game.retry()
})
</script>

<template>
  <GameStateLayout>
    <template #content>
      <div class="grid grid-cols-2 gap-4">
        <UPageFeature :title="config.region.title" :description="config.game.title" class="col-span-2 mb-4" />
        <UPageFeature :title="game.totalQuestions.value.toString()" description="Flags" icon="i-tabler-flag" />

        <UPageFeature v-if="config.game.mode === 'type-answer'" title="Type Answer" description="Mode" icon="i-tabler-keyboard" />
        <UPageFeature v-else title="Multiple Choice" description="Mode" icon="i-tabler-layout-grid" />

        <UPageFeature
          v-if="config.game.difficulty === 'practice'"
          title="Practice"
          description="Difficulty"
          icon="i-tabler-school"
        />
        <UPageFeature
          v-else
          title="Test"
          description="Difficulty"
          icon="i-tabler-cards"
        />

        <UPageFeature :title="`${accuracyPct} %`" description="Score" icon="i-tabler-trophy" />
        <UPageFeature :title="game.timerLabel.value" description="Time" icon="i-tabler-stopwatch" />

        <div v-if="hasWrongAnswers" class="flex justify-center mt-4 col-span-2">
          <UButton icon="i-tabler-eye" label="Review wrong answers" variant="soft" @click="game.reviewWrongFlags" />
        </div>
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-player-skip-back-filled"
          label="Retry"
          @click="game.retry"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-skip-forward-filled"
          label="Finish"
          @click="emit('back')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
