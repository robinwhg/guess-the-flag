<script setup lang="ts">
const props = defineProps<{
  totalQuestions: number
  totalCorrectQuestions: number
  timerLabel: string
  gameTitle: string
  regionTitle: string
}>()

const emit = defineEmits<{
  retry: []
  back: []
}>()

const { totalQuestions, totalCorrectQuestions } = toRefs(props)

const accuracyPct = computed(() => {
  if (totalQuestions.value === 0)
    return 0

  return Math.round((totalCorrectQuestions.value / totalQuestions.value) * 100)
})
</script>

<template>
  <GameStateLayout>
    <template #content>
      <div class="overflow-y-auto grid grid-cols-2 gap-4">
        <UPageFeature :title="regionTitle" :description="gameTitle" class="col-span-2" />

        <UPageFeature :title="totalQuestions.toString()" description="Flags" icon="i-tabler-flag-filled" />

        <UPageFeature title="Multiple Choice" description="Mode" icon="i-tabler-layout-grid-filled" />

        <UPageFeature :title="`${accuracyPct} %`" description="Score" icon="i-tabler-trophy-filled" />

        <UPageFeature :title="timerLabel" description="Time" icon="i-tabler-clock-filled" />
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
