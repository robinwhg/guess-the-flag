<script setup lang="ts">
const props = defineProps<{
  regionSlug: string
  gameSlug: string
}>()

const { regionSlug, gameSlug } = toRefs(props)
const { getScoresForGame } = useScoreHistory()

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

const tableRows = computed(() => {
  return scores.value.map(score => ({
    id: score.id,
    date: formatLocalDateTime(score.createdAt),
    score: `${score.totalCorrectQuestions} / ${score.totalQuestions}`,
    accuracy: `${calculateAccuracy(score.totalCorrectQuestions, score.totalQuestions)} %`,
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
