const CHOICE_COUNT = 4
const ADVANCE_DELAY = 600

export function useGame(countries: Country[]) {
  const questions = ref(shuffle(countries))
  const currentIndex = ref(0)
  const currentQuestion = computed(() => questions.value[currentIndex.value])
  const wrongQuestions = ref<Country[]>([])

  const isPaused = ref(false)
  const isFinished = computed(() => questions.value.length >= currentIndex.value + 1)

  interface Choice {
    country: Country
    isCorrect: boolean
    showOverlay: Ref<boolean>
  }

  const choices = computed(() => {
    if (!currentQuestion.value)
      return []

    const distractors = shuffle(countries.filter(country => country.cca3 !== currentQuestion.value?.cca3)).slice(0, CHOICE_COUNT - 1)

    const choicePool = shuffle([currentQuestion.value, ...distractors])

    const choices = choicePool.map((choice) => {
      return {
        country: choice,
        isCorrect: choice.cca3 === currentQuestion.value?.cca3,
        showOverlay: ref(false),
      }
    })

    return choices
  })

  function selectChoice(choice: Choice) {
    if (!currentQuestion.value)
      return

    if (!choice.isCorrect)
      wrongQuestions.value.push(currentQuestion.value)

    choice.showOverlay.value = true

    setTimeout(() => {
      currentIndex.value += 1
      choice.showOverlay.value = false
    }, ADVANCE_DELAY)
  }

  return {
    isPaused,
    isFinished,
    questions,
    currentIndex,
    currentQuestion,
    choices,
    selectChoice,
  }
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = current
  }

  return shuffled
}
