<script setup lang="ts">
const emit = defineEmits<{
  resume: []
  exit: []
}>()
</script>

<template>
  <div class="absolute inset-0 z-20 flex items-center justify-center bg-default/80 p-4 backdrop-blur-sm">
    <UPageCard
      title="Paused"
      description="Take a breath. Your run is waiting."
      icon="i-tabler-player-pause"
      class="w-full max-w-md"
    >
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <UButton
          label="Resume"
          icon="i-tabler-player-play"
          color="primary"
          variant="solid"
          @click="emit('resume')"
        />

        <UButton
          label="Exit to setup"
          icon="i-tabler-arrow-left"
          color="neutral"
          variant="outline"
          @click="emit('exit')"
        />
      </div>
    </UPageCard>
  </div>
</template>
