<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const emit = defineEmits<{
  back: []
}>()
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
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-arrow-left"
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
