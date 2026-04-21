<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <GameStateLayout>
    <template #header>
      <UPageFeature :title="config.region.title" :description="config.game.title" />
    </template>

    <template #content>
      <div class="grid grid-cols-2 gap-4">
        <UPageFeature :title="game.totalQuestions.value.toString()" description="Flags" icon="i-tabler-flag-filled" />

        <UPageFeature
          v-if="config.game.mode === 'type-answer'"
          title="Type Answer"
          description="Mode"
          icon="i-tabler-keyboard-filled"
        />
        <UPageFeature
          v-else
          title="Multiple Choice"
          description="Mode"
          icon="i-tabler-layout-grid-filled"
        />

        <UPageFeature
          v-if="config.game.difficulty === 'practice'"
          title="Practice"
          description="Difficulty"
          icon="i-tabler-file-description-filled"
        />
        <UPageFeature
          v-else
          title="Test"
          description="Difficulty"
          icon="i-tabler-school-filled"
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
