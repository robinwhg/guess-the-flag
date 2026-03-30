<script setup lang="ts">
type GameMode = 'countries' | 'territories' | 'both'

interface GameRunResult {
  runId: string
  regionSlug: string
  regionName: string
  gameMode: GameMode
  totalQuestions: number
  correctCount: number
  durationMs: number
  finishedAt: string
}

interface GameEndCardProps {
  result: GameRunResult
}

const props = defineProps<GameEndCardProps>()

const emit = defineEmits<{
  retry: []
  back: []
}>()

const { result } = toRefs(props)

const durationLabel = computed(() => {
  const totalSeconds = Math.floor(result.value.durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
})

const finishedAtLabel = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(result.value.finishedAt))
})

const modeLabel = computed(() => {
  if (result.value.gameMode === 'both') {
    return 'Countries + Territories'
  }

  if (result.value.gameMode === 'territories') {
    return 'Territories'
  }

  return 'Countries'
})

const accuracyPct = computed(() => {
  if (result.value.totalQuestions === 0) {
    return 0
  }

  return Math.round((result.value.correctCount / result.value.totalQuestions) * 100)
})
</script>

<template>
  <div class="max-w-2xl mx-auto grid grid-cols-2 gap-4">
    <h2 class="text-xl font-semibold col-span-2">
      Run complete!
    </h2>

    <UCard :ui="{ root: 'col-span-2 divide-none', body: 'grid grid-cols-2 items-stretch gap-4' }">
      <template #header>
        <div class="flex flex-col gap-2 col-span-2">
          <p class="text-base text-pretty font-semibold text-highlighted">
            Accuracy
          </p>
          <UProgress
            :model-value="result.correctCount"
            :max="result.totalQuestions"
            color="success"
            :ui="{ base: 'bg-error' }"
          />
          <div class="inline-flex items-center justify-between text-sm">
            <span class="font-semibold">
              {{ result.correctCount }} out of {{ result.totalQuestions }} Flags
            </span>
            <span class="text-muted">
              {{ accuracyPct }} %
            </span>
          </div>
        </div>
      </template>

      <UPageFeature
        icon="i-tabler-map-pin"
        :title="result.regionName"
        description="Region"
      />

      <UPageFeature
        icon="i-tabler-flag"
        :title="modeLabel"
        description="Mode"
      />

      <UPageFeature
        icon="i-tabler-stopwatch"
        :title="durationLabel"
        description="Time"
      />

      <UPageFeature
        icon="i-tabler-clock"
        :title="finishedAtLabel"
        description="Date"
      />
    </UCard>

    <BaseCardButton
      icon="i-tabler-reload"
      label="Retry"
      @click="emit('retry')"
    />

    <BaseCardButton
      color="primary"
      icon="i-tabler-arrow-forward"
      label="Continue"
      @click="emit('back')"
    />
  </div>
</template>
