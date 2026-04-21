<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

onKeyStroke('Enter', (event) => {
  if (event.repeat)
    return

  game.startGame()
})

onKeyStroke('Backspace', (event) => {
  if (event.repeat)
    return

  emit('back')
})
</script>

<template>
  <GameStateLayout>
    <template #content>
      <div class="grid grid-cols-2 gap-4">
        <UPageFeature :title="config.region.title" :description="config.game.title" class="col-span-2 mb-4" />

        <UPageFeature :title="game.totalQuestions.value.toString()" description="Flags" icon="i-tabler-flag" />

        <UPageFeature
          v-if="config.game.mode === 'type-answer'"
          title="Type Answer"
          description="Mode"
          icon="i-tabler-keyboard"
        />
        <UPageFeature
          v-else
          title="Multiple Choice"
          description="Mode"
          icon="i-tabler-layout-grid"
        />

        <UPageFeature
          v-if="config.game.difficulty === 'practice'"
          title="Practice"
          description="Difficulty"
          icon="i-tabler-file-description"
        />
        <UPageFeature
          v-else
          title="Test"
          description="Difficulty"
          icon="i-tabler-school"
        />
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-player-eject-filled"
          label="Back"
          @click="emit('back')"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-play-filled"
          label="Start"
          @click="game.startGame"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
