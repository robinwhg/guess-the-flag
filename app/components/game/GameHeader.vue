<script setup lang="ts">
interface GameHeaderState {
  currentQuestionNumber: number
  answeredQuestions: number
  totalQuestions: number
  elapsedSeconds: number
  isErrorFeedbackActive: boolean
}

interface GameHeaderProps {
  state: GameHeaderState
}

const props = defineProps<GameHeaderProps>()

const isPaused = defineModel<boolean>('paused', {
  default: false,
})

const progress = computed(() => {
  if (props.state.totalQuestions === 0) {
    return 0
  }

  return Math.round((props.state.answeredQuestions / props.state.totalQuestions) * 100)
})

const timerLabel = computed(() => {
  const minutes = Math.floor(props.state.elapsedSeconds / 60).toString().padStart(2, '0')
  const seconds = (props.state.elapsedSeconds % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
})
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 items-center gap-4">
    <div class="order-1 lg:order-1 col-span-1">
      <h2 class="text-xl font-semibold">
        What flag is this?
      </h2>
    </div>

    <div class="order-2 lg:order-3 flex items-center gap-2 justify-end">
      <UIcon name="i-tabler-clock-filled" class="size-6" />
      <span class="text-xl font-semibold">
        {{ timerLabel }}
      </span>
      <UButton
        :icon="isPaused ? 'i-tabler-player-play-filled' : 'i-tabler-player-pause-filled'"
        :aria-label="isPaused ? 'resume' : 'pause'"
        color="neutral"
        variant="ghost"
        size="xl"
        @click="isPaused = !isPaused"
      />
    </div>

    <div class="order-3 lg:order-2 col-span-2 lg:col-span-3">
      <div class="flex flex-col gap-2 lg:max-w-2xl mx-auto">
        <UProgress
          :model-value="progress"
          :color="props.state.isErrorFeedbackActive ? 'error' : 'primary'"
          :ui="{ indicator: props.state.isErrorFeedbackActive ? 'animate-pulse' : '' }"
        />
        <div class="inline-flex items-center justify-between text-sm">
          <span class="font-semibold">
            Flag {{ props.state.currentQuestionNumber }} of {{ props.state.totalQuestions }}
          </span>
          <span class="text-muted">
            {{ progress }} %
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
