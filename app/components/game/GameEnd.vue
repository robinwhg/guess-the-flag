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
</script>

<template>
  <GameStateLayout>
    <template #header>
      <UPageFeature :title="config.region.title" :description="config.game.title" />
    </template>

    <template #content>
      <div class="overflow-y-auto grid grid-cols-2 gap-4">
        <UPageFeature :title="game.totalQuestions.value.toString()" description="Flags" icon="i-tabler-flag-filled" />

        <UPageFeature v-if="config.game.mode === 'type-answer'" title="Type Answer" description="Mode" icon="i-tabler-keyboard-filled" />
        <UPageFeature v-else title="Multiple Choice" description="Mode" icon="i-tabler-layout-grid-filled" />

        <UPageFeature :title="`${accuracyPct} %`" description="Score" icon="i-tabler-trophy-filled" />

        <UPageFeature :title="game.timerLabel.value" description="Time" icon="i-tabler-clock-filled" />
      </div>
    </template>

    <template v-if="hasWrongAnswers" #footer>
      <div class="flex justify-center">
        <UButton icon="i-tabler-target-arrow" label="Review round" variant="soft" @click="game.reviewWrongFlags" />
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-restore"
          label="Retry"
          @click="game.retry"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-arrow-right"
          label="Continue"
          @click="emit('back')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
