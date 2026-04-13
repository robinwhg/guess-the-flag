<script setup lang="ts">
const props = defineProps<{
  totalQuestions: number
  totalCorrectQuestions: number
  timerLabel: string
}>()

const emit = defineEmits<{
  retry: []
  back: []
}>()

const { totalQuestions, totalCorrectQuestions, timerLabel } = toRefs(props)

const accuracyPct = computed(() => {
  if (totalQuestions.value === 0)
    return 0

  return Math.round((totalCorrectQuestions.value / totalQuestions.value) * 100)
})

// TODO: Show more info
</script>

<template>
  <GameStateLayout>
    <template #content>
      <div class="flex h-full flex-col gap-4 overflow-y-auto">
        <p class="text-xl font-semibold">
          Your score
        </p>

        <div class="flex flex-col gap-2">
          <p class="text-base text-pretty font-semibold text-highlighted">
            Accuracy
          </p>
          <UProgress
            :model-value="totalCorrectQuestions"
            :max="totalQuestions"
            color="success"
            :ui="{ base: 'bg-error' }"
          />
          <div class="inline-flex items-center justify-between text-sm">
            <span class="font-semibold">
              {{ totalCorrectQuestions }} out of {{ totalQuestions }} Flags
            </span>
            <span class="text-muted">
              {{ accuracyPct }} %
            </span>
          </div>
        </div>

        <div class="inline-flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-base text-pretty font-semibold text-highlighted">
            <UIcon name="i-tabler-stopwatch" class="size-5 shrink-0" />
            Time
          </span>
          <span class="text-muted font-mono">
            {{ timerLabel }}
          </span>
        </div>
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-player-skip-back-filled"
          label="Retry"
          @click="emit('retry')"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-skip-forward-filled"
          label="Continue"
          @click="emit('back')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
