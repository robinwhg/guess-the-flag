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

function handleResume(): void {
  isPaused.value = false
}

function handleExit(): void {
  isPaused.value = false
  emit('back')
}
</script>

<template>
  <section class="space-y-12">
    <GameHeader v-model:paused="isPaused" />

    <Transition name="fade" mode="out-in">
      <GamePause
        v-if="isPaused"
        key="paused"
        @resume="handleResume"
        @exit="handleExit"
      />

      <div
        v-else-if="currentQuestion"
        key="playing"
        class="space-y-12"
      >
        <img
          :src="currentQuestion.flag.svg"
          :alt="currentQuestion.flag.alt"
          class="mx-auto h-56 w-full object-contain lg:h-72"
        >

        <div class="mx-auto grid max-w-2xl grid-cols-2 items-stretch gap-4">
          <UCard
            v-for="choice in choices"
            :key="choice.cca2"
            :ui="{ root: 'h-full min-h-24 cursor-pointer flex p-1 sm:p-1', body: 'flex-1 flex items-center justify-center' }"
          >
            <p class="line-clamp-3 text-center text-base font-semibold sm:text-xl">
              {{ choice.name.common }}
            </p>
          </UCard>
        </div>
      </div>

      <div
        v-else
        key="empty"
        class="py-6 text-center text-sm text-muted"
      >
        No questions available for this game.
      </div>
    </Transition>
  </section>
</template>
