const CHOICE_COUNT = 4
const ADVANCE_DELAY = 600
const TIMER_TIMEOUT = 1000
const MAX_ELAPSED_SECONDS = 90 * 60

export interface Choice {
  country: Country
  isCorrect: boolean
  showOverlay: Ref<boolean>
}

export type GameState = 'start' | 'play' | 'pause' | 'end'

export function useGame(countries: Country[]) {
  const gameState = ref<GameState>('start')
  const isAdvancing = ref(false)
  const questions = ref(shuffle(countries))
  const index = ref(0)
  const wrongQuestions = ref<Country[]>([])
  const elapsedSeconds = ref(0)

  const isFinished = computed(() => index.value >= questions.value.length)
  const question = computed(() => questions.value[index.value])
  const totalQuestions = computed(() => questions.value.length)
  const totalCorrectQuestions = computed(() => questions.value.length - wrongQuestions.value.length)
  const timerLabel = computed(() => {
    const minutes = Math.floor(elapsedSeconds.value / 60)
      .toString()
      .padStart(2, '0')

    const seconds = (elapsedSeconds.value % 60)
      .toString()
      .padStart(2, '0')

    return `${minutes}:${seconds}`
  })
  const choices = computed(() => {
    if (!question.value)
      return []

    const distractors = shuffle(countries.filter(country => country.cca3 !== question.value?.cca3)).slice(0, CHOICE_COUNT - 1)
    const choicePool = shuffle([question.value, ...distractors])

    return choicePool.map((choice) => {
      return {
        country: choice,
        isCorrect: choice.cca3 === question.value?.cca3,
        showOverlay: ref(false),
      }
    })
  })

  function selectChoice(choice: Choice) {
    if (gameState.value !== 'play' || !question.value || isAdvancing.value)
      return

    isAdvancing.value = true

    if (!choice.isCorrect)
      wrongQuestions.value.push(question.value)

    choice.showOverlay.value = true

    setTimeout(() => {
      index.value += 1
      choice.showOverlay.value = false
      isAdvancing.value = false

      if (index.value >= questions.value.length)
        gameState.value = 'end'
    }, ADVANCE_DELAY)
  }

  function resetRun() {
    questions.value = shuffle(countries)
    index.value = 0
    wrongQuestions.value = []
    elapsedSeconds.value = 0
    isAdvancing.value = false
  }

  function startGame() {
    gameState.value = questions.value.length > 0 ? 'play' : 'end'
  }

  function pauseGame() {
    if (gameState.value !== 'play' || isAdvancing.value)
      return

    gameState.value = 'pause'
  }

  function resumeGame() {
    if (gameState.value !== 'pause')
      return

    gameState.value = 'play'
  }

  function retry() {
    resetRun()
    gameState.value = questions.value.length > 0 ? 'play' : 'end'
  }

  function stopToStart() {
    resetRun()
    gameState.value = 'start'
  }

  const timer = setInterval(() => {
    if (gameState.value !== 'play')
      return

    elapsedSeconds.value += 1

    if (elapsedSeconds.value >= MAX_ELAPSED_SECONDS)
      stopToStart()
  }, TIMER_TIMEOUT)

  onScopeDispose(() => {
    clearInterval(timer)
  })

  return {
    gameState,
    isAdvancing,
    questions,
    index,
    wrongQuestions,
    elapsedSeconds,
    timerLabel,
    isFinished,
    question,
    totalQuestions,
    totalCorrectQuestions,
    choices,
    startGame,
    pauseGame,
    resumeGame,
    selectChoice,
    stopToStart,
    retry,
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
