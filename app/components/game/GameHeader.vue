<script setup lang="ts">
import type { GameState } from '~/composables/useGame'

const props = defineProps<{
  currentIndex: number
  totalQuestions: number
  timerLabel: string
  isAdvancing: boolean
  gameState: GameState
}>()

const emit = defineEmits<{
  togglePause: []
}>()

const { currentIndex, totalQuestions, isAdvancing } = toRefs(props)

const progressPct = computed(() => {
  if (totalQuestions.value === 0)
    return 0

  const progress = Math.round(((currentIndex.value + (isAdvancing.value ? 1 : 0)) / totalQuestions.value) * 100)

  return Math.min(progress, 100)
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="gameState === 'start'"
      key="start"
      class="grid grid-cols-2 lg:grid-cols-5 items-center gap-2"
    >
      <div
        class="order-1 lg:order-1 col-span-2 lg:col-span-5"
      >
        <p class="text-xl font-semibold">
          Ready to start?
        </p>
      </div>
    </div>

    <div
      v-else-if="gameState === 'play' || gameState === 'pause'"
      key="run"
      class="grid grid-cols-2 lg:grid-cols-5 items-center gap-2"
    >
      <div class="order-1 lg:order-1 col-span-1">
        <p class="text-xl font-semibold">
          What flag is this?
        </p>
      </div>

      <div class="order-2 lg:order-3 flex items-center gap-2 justify-end">
        <UIcon name="i-tabler-clock-filled" class="shrink-0 size-6" />
        <span class="text-xl font-semibold font-mono">
          {{ timerLabel }}
        </span>
        <UButton
          :icon="gameState === 'pause' ? 'i-tabler-player-play-filled' : 'i-tabler-player-pause-filled'"
          :aria-label="gameState === 'pause' ? 'resume' : 'pause'"
          color="neutral"
          variant="ghost"
          size="xl"
          @click="emit('togglePause')"
        />
      </div>

      <div class="order-3 lg:order-2 col-span-2 lg:col-span-3">
        <div class="flex flex-col gap-2 lg:max-w-2xl mx-auto">
          <UProgress
            :model-value="progressPct"
          />
          <div class="inline-flex items-center justify-between text-sm">
            <span class="font-semibold">
              Flag {{ currentIndex + 1 }} of {{ totalQuestions }}
            </span>
            <span class="text-muted">
              {{ progressPct }} %
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      key="end"
      class="grid grid-cols-2 lg:grid-cols-5 items-center gap-2"
    >
      <div
        class="order-1 lg:order-1 col-span-2 lg:col-span-5"
      >
        <p class="text-xl font-semibold">
          Run complete!
        </p>
      </div>
    </div>
  </Transition>
</template>
