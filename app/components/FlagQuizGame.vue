<script setup lang="ts">
interface FlagQuizGameProps {
  questions: Country[]
  context: Country[]
}

const props = defineProps<FlagQuizGameProps>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <UPageCard
    title="Flag Quiz"
    description="Game engine scaffold. Question flow and scoring will be added next with opinionated multiple-choice defaults."
    icon="i-tabler-flag"
    variant="subtle"
  >
    <div class="space-y-2">
      <p class="text-sm text-muted">
        {{ props.questions.length }} questions ready
      </p>

      <p class="text-sm text-muted">
        {{ props.context.length }} countries available for plausible multiple-choice distractors
      </p>

      <UButton
        label="Back to setup"
        color="neutral"
        variant="ghost"
        @click="emit('back')"
      />
    </div>
  </UPageCard>
</template>
