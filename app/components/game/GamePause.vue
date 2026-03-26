<script setup lang="ts">
const emit = defineEmits<{
  resume: []
  exit: []
}>()
</script>

<template>
  <div class="grid grid-cols-2 items-stretch gap-4 max-w-2xl mx-auto">
    <div class="col-span-2 h-64 lg:h-80 flex p-4">
      <UCard
        :ui="{ root: 'mx-auto h-full aspect-3/2 flex', body: 'flex-1 flex flex-col items-center justify-center text-dimmed' }"
      >
        <UIcon name="i-tabler-player-pause-filled" class="size-20 lg:size-32" />
      </UCard>
    </div>

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
