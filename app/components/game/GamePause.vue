<script setup lang="ts">
const emit = defineEmits<{
  resume: []
  exit: []
}>()
</script>

<template>
  <GameStateLayout>
    <template #content>
      <UCard :ui="{ root: 'dark:bg-default', body: 'p-4 sm:p-4 relative h-64 lg:h-80 flex flex-col items-center justify-center text-dimmed' }">
        <UIcon name="i-tabler-player-pause-filled" class="size-20 lg:size-32" />
        <h2 class="text-xl font-semibold">
          Game paused
        </h2>
      </UCard>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 items-stretch gap-4">
        <BaseCardButton
          icon="i-tabler-player-stop-filled"
          label="Stop"
          @click="emit('exit')"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-play-filled"
          label="Resume"
          @click="emit('resume')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
