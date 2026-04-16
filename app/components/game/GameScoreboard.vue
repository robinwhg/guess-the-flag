<script setup lang="ts">
const props = defineProps<{
  regionSlug: string
  gameSlug: string
}>()

const { regionSlug, gameSlug } = toRefs(props)
const { getScoresForGame } = useScoreHistory()

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const scores = computed(() => {
  return getScoresForGame(regionSlug.value, gameSlug.value)
})

const columns = [
  {
    accessorKey: 'accuracy',
    header: 'Accuracy',
  },
  {
    accessorKey: 'score',
    header: 'Score',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
]

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')

  const seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, '0')

  return `${minutes}:${seconds}`
}

function getAccuracy(score: { totalCorrectQuestions: number, totalQuestions: number }) {
  if (!score.totalQuestions)
    return 0

  return Math.round((score.totalCorrectQuestions / score.totalQuestions) * 100)
}

const tableRows = computed(() => {
  return scores.value.map(score => ({
    id: score.id,
    date: formatDate(score.createdAt),
    score: `${score.totalCorrectQuestions} / ${score.totalQuestions}`,
    accuracy: `${getAccuracy(score)} %`,
    time: formatDuration(score.elapsedSeconds),
  }))
})
</script>

<template>
  <section class="space-y-4">
    <p class="text-xl font-semibold">
      Previous runs
    </p>

    <Transition name="slide-up" mode="out-in" appear>
      <UCard :ui="{ root: 'max-w-2xl mx-auto', body: 'p-0 sm:p-0' }">
        <UTable
          :data="tableRows"
          :columns="columns"
          empty="No score yet."
        />
      </UCard>
    </Transition>
  </section>
</template>
