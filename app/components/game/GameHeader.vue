<script setup lang="ts">
const emit = defineEmits<{
  pause: []
}>()

const question = 6
const total = 25
const timerLabel = '01:42'
const progress = (question / total) * 100
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 items-center gap-4">
    <div class="order-1 lg:order-1 col-span-1">
      <h2 class="text-xl font-semibold">
        What flag is this?
      </h2>
    </div>

    <div class="order-2 lg:order-3 flex items-center gap-2 justify-end">
      <UIcon name="i-tabler-clock" class="size-6" />
      <span class="text-xl font-semibold">
        {{ timerLabel }}
      </span>
      <UButton icon="i-tabler-player-pause" aria-label="pause" color="neutral" variant="ghost" size="xl" @click="emit('pause')" />
    </div>

    <div class="order-3 lg:order-2 col-span-2 lg:col-span-3">
      <div class="flex flex-col gap-2 lg:max-w-2xl mx-auto">
        <UProgress :model-value="progress" />
        <div class="inline-flex items-center justify-between text-sm">
          <span class="font-semibold">
            Flag {{ question }} of {{ total }}
          </span>
          <span class="text-muted">
            {{ progress }} %
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
