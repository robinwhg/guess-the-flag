<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'

const props = defineProps<{
  regionSlug: string
  gameSlug: string
  gameMode: GameMode
}>()

interface ScoreboardRow {
  id: string
  date: string
  score: string
  accuracy: number
  time: string
}

interface SortableColumn {
  getIsSorted: () => false | 'asc' | 'desc'
  toggleSorting: (descending?: boolean) => void
}

const UButton = resolveComponent('UButton')

const { regionSlug, gameSlug, gameMode } = toRefs(props)
const { getScoresForGame } = useScoreHistory()

const scores = computed(() => {
  return getScoresForGame(regionSlug.value, gameSlug.value, gameMode.value)
})

function getSortButton(column: SortableColumn, label: string) {
  const isSorted = column.getIsSorted()

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    icon: isSorted
      ? isSorted === 'asc'
        ? 'i-tabler-sort-ascending'
        : 'i-tabler-sort-descending'
      : 'i-tabler-arrows-sort',
    class: '-mx-2.5',
    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  })
}

const columns: TableColumn<ScoreboardRow>[] = [
  {
    accessorKey: 'accuracy',
    header: ({ column }) => getSortButton(column, 'Accuracy'),
    cell: ({ row }) => `${row.original.accuracy} %`,
  },
  {
    accessorKey: 'score',
    header: 'Score',
  },
  {
    accessorKey: 'time',
    header: ({ column }) => getSortButton(column, 'Time'),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => getSortButton(column, 'Date'),
  },
]

const sorting = ref([
  {
    id: 'date',
    desc: false,
  },
])

const data = computed<ScoreboardRow[]>(() => {
  return scores.value.map(score => ({
    id: score.id,
    date: formatLocalDateTime(score.createdAt),
    score: `${score.totalCorrectQuestions} / ${score.totalQuestions}`,
    accuracy: calculateAccuracy(score.totalCorrectQuestions, score.totalQuestions),
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
          v-model:sorting="sorting"
          :data
          :columns
          empty="No score yet."
        />
      </UCard>
    </Transition>
  </section>
</template>
