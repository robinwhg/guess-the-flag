<script setup lang="ts">
interface FlagQuizGameProps {
  questions: Country[]
  context?: Country[]
}

const props = defineProps<FlagQuizGameProps>()

const emit = defineEmits<{
  back: []
}>()

const isPaused = ref(false)

const CHOICE_COUNT = 4

const currentIndex = ref(0)

const effectiveContext = computed(() => {
  return props.context?.length ? props.context : props.questions
})

const currentQuestion = computed(() => {
  return props.questions[currentIndex.value] ?? null
})

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

function uniqueByCca2(items: Country[]): Country[] {
  const seen = new Set<string>()
  const result: Country[] = []

  for (const item of items) {
    if (seen.has(item.cca2)) {
      continue
    }

    seen.add(item.cca2)
    result.push(item)
  }

  return result
}

const choices = computed(() => {
  if (!currentQuestion.value) {
    return [] as Country[]
  }

  const correct = currentQuestion.value
  const pool = uniqueByCca2(effectiveContext.value)
  const distractors: Country[] = []
  const pickedCodes = new Set<string>([correct.cca2])

  const sameSubregion = shuffle(pool.filter(country => country.subregion === correct.subregion && country.cca2 !== correct.cca2))
  const sameRegion = shuffle(pool.filter(country => country.region === correct.region && country.cca2 !== correct.cca2))
  const globalFallback = shuffle(pool.filter(country => country.cca2 !== correct.cca2))

  for (const candidate of [...sameSubregion, ...sameRegion, ...globalFallback]) {
    if (pickedCodes.has(candidate.cca2)) {
      continue
    }

    pickedCodes.add(candidate.cca2)
    distractors.push(candidate)

    if (distractors.length >= CHOICE_COUNT - 1) {
      break
    }
  }

  return shuffle([correct, ...distractors]).slice(0, CHOICE_COUNT)
})

defineExpose({
  currentQuestion,
  choices,
})

function handlePause(): void {
  isPaused.value = true
}

function handleResume(): void {
  isPaused.value = false
}

function handleExit(): void {
  isPaused.value = false
  emit('back')
}
</script>

<template>
  <section class="space-y-4">
    <GameHeader @pause="handlePause" />

    <div class="relative">
      <UPageCard
        title="Game Body"
        description="Question content, flag media, and answer controls will be designed in the next step."
        icon="i-tabler-layout-grid"
        variant="subtle"
      >
        <div class="space-y-2">
          <p class="text-sm text-muted">
            {{ props.questions.length }} questions ready
          </p>

          <p class="text-sm text-muted">
            {{ effectiveContext.length }} countries available for plausible multiple-choice distractors
          </p>
        </div>
      </UPageCard>

      <GamePause
        v-if="isPaused"
        @resume="handleResume"
        @exit="handleExit"
      />
    </div>

    <UPageCard
      title="Footer"
      description="Secondary actions and helper information can live here."
      icon="i-tabler-layout-navbar"
      variant="subtle"
    />
  </section>
</template>
