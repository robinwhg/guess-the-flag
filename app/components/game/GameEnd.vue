<script setup lang="ts">
const props = defineProps<{
  totalQuestions: number
  totalCorrectQuestions: number
  timerLabel: string
  gameTitle: string
  regionTitle: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'back'): void
  (e: 'review'): void
}>()

const { totalQuestions, totalCorrectQuestions } = toRefs(props)

const hasWrongAnswers = computed(() => totalCorrectQuestions.value < totalQuestions.value)

const accuracyPct = computed(() => {
  if (totalQuestions.value === 0)
    return 0

  return Math.round((totalCorrectQuestions.value / totalQuestions.value) * 100)
})
</script>

<template>
  <GameStateLayout>
    <template #header>
      <UPageFeature :title="regionTitle" :description="gameTitle" />
    </template>

    <template #content>
      <div class="overflow-y-auto grid grid-cols-2 gap-4">
        <UPageFeature :title="totalQuestions.toString()" description="Flags" icon="i-tabler-flag-filled" />

        <UPageFeature title="Multiple Choice" description="Mode" icon="i-tabler-layout-grid-filled" />

        <UPageFeature :title="`${accuracyPct} %`" description="Score" icon="i-tabler-trophy-filled" />

        <UPageFeature :title="timerLabel" description="Time" icon="i-tabler-clock-filled" />
      </div>
    </template>

    <template v-if="hasWrongAnswers" #footer>
      <div class="flex justify-center">
        <UButton icon="i-tabler-target-arrow" label="Review round" variant="soft" @click="emit('review')" />
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <BaseCardButton
          icon="i-tabler-restore"
          label="Retry"
          @click="emit('retry')"
        />

        <BaseCardButton
          color="primary"
          icon="i-tabler-arrow-right"
          label="Continue"
          @click="emit('back')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
