<script setup lang="ts">
const { game } = defineProps<{
  game: GameRuntime
}>()

onKeyStroke('Enter', (event) => {
  if (event.repeat)
    return

  game.resumeGame()
})

onKeyStroke(' ', (event) => {
  if (event.repeat)
    return

  event.preventDefault()
  game.resumeGame()
})

onKeyStroke('Backspace', (event) => {
  if (event.repeat)
    return

  game.stopToStart()
})
</script>

<template>
  <GameStateLayout fixed-card>
    <template #content>
      <div class="flex flex-col items-center justify-center text-dimmed h-48 lg:h-80">
        <UIcon name="i-tabler-player-pause-filled" class="size-20 lg:size-32" />
        <h2 class="text-xl font-semibold">
          Game paused
        </h2>
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 items-stretch gap-4">
        <BaseCardButton
          icon="i-tabler-player-stop-filled"
          label="Stop"
          @click="game.stopToStart"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-play-filled"
          label="Resume"
          @click="game.resumeGame"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
