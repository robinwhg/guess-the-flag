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
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(result.value.finishedAt))
})

const modeLabel = computed(() => {
  if (result.value.gameMode === 'both') {
    return 'Both'
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

// TODO: Add UI design
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">
      Run complete!
    </h2>
    <div class="grid grid-cols-2 items-stretch gap-4 max-w-2xl mx-auto">
      <UCard :ui="{ root: 'col-span-2', body: 'p-4 sm:p-4 relative h-64 lg:h-80' }">
        <ul>
          <li>Accuracy: {{ accuracyPct }} %</li>
          <li>Correctness: {{ props.result.correctCount }} / {{ result.totalQuestions }}</li>
          <li>Time: {{ durationLabel }}</li>
          <li>Mode: {{ modeLabel }}</li>
          <li>Region: {{ result.regionName }}</li>
          <li>Date: {{ finishedAtLabel }}</li>
        </ul>
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
  </div>
</template>
