<script setup lang="ts">
const emit = defineEmits<{
  resume: []
  exit: []
}>()
</script>

<template>
  <div class="grid grid-cols-2 items-stretch gap-4 max-w-2xl mx-auto">
    <Transition name="slide-side" appear>
      <UCard
        variant="soft" :ui="{ root: 'col-span-2 dark:bg-default', body: 'p-4 sm:p-4 relative h-64 lg:h-80 flex items-center justify-center' }"
      >
        <UIcon name="i-tabler-player-pause-filled" class="size-20 lg:size-32 text-dimmed" />
      </UCard>
    </Transition>

    <TransitionGroup
      name="slide-up"
      tag="div"
      class="col-span-2 grid grid-cols-2 items-stretch gap-4"
      appear
    >
      <div key="pause-stop">
        <BaseCardButton
          icon="i-tabler-player-stop-filled"
          label="Stop"
          @click="emit('exit')"
        />
      </div>

      <div key="pause-resume">
        <BaseCardButton
          color="primary"
          icon="i-tabler-player-play-filled"
          label="Resume"
          @click="emit('resume')"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
