const CHOICE_COUNT = 4
const ADVANCE_DELAY = 600
const TIMER_TIMEOUT = 1000
const MAX_ELAPSED_SECONDS = 90 * 60

export interface Choice {
  country: Country
  isCorrect: boolean
  selected: boolean
}

export type GameState = 'start' | 'play' | 'pause' | 'end'

export function useGame(gameCountries: Country[]) {
  const gameState = ref<GameState>('start')
  const isAdvancing = ref(false)
  const showOverlay = ref(false)
  const questions = ref(shuffle(gameCountries))
  const index = ref(0)
  const wrongQuestions = ref<Country[]>([])
  const elapsedSeconds = ref(0)

  const isFinished = computed(() => index.value >= questions.value.length)
  const currentQuestion = computed(() => questions.value[index.value])
  const totalQuestions = computed(() => questions.value.length)
  const totalCorrectQuestions = computed(() => questions.value.length - wrongQuestions.value.length)
  const timerLabel = computed(() => formatDuration(elapsedSeconds.value))
  const choices = computed(() => {
    if (!currentQuestion.value)
      return []

    const q = currentQuestion.value
    const requiredDistractors = CHOICE_COUNT - 1
    const gamePool = gameCountries.filter(country => country.cca3 !== q.cca3)
    const globalPool = countries.filter(country => country.cca3 !== q.cca3)

    const distractors: Country[] = []
    const usedCountryCodes = new Set<string>([q.cca3])

    function addFromPool(pool: Country[]) {
      for (const country of shuffle(pool)) {
        if (distractors.length >= requiredDistractors)
          break

        if (usedCountryCodes.has(country.cca3))
          continue

        distractors.push(country)
        usedCountryCodes.add(country.cca3)
      }
    }

    if (q.subregion)
      addFromPool(gamePool.filter(country => country.subregion === q.subregion))

    addFromPool(gamePool.filter(country =>
      country.region === q.region
      && (!q.subregion || country.subregion !== q.subregion),
    ))

    addFromPool(gamePool.filter(country => country.region !== q.region))

    if (q.subregion)
      addFromPool(globalPool.filter(country => country.subregion === q.subregion))

    addFromPool(globalPool.filter(country =>
      country.region === q.region
      && (!q.subregion || country.subregion !== q.subregion),
    ))

    addFromPool(globalPool.filter(country => country.region !== q.region))
    addFromPool(globalPool)

    const choicePool = shuffle([q, ...distractors.slice(0, requiredDistractors)])

    return choicePool.map((choice) => {
      return {
        country: choice,
        isCorrect: choice.cca3 === q.cca3,
        selected: false,
      }
    })
  })

  function selectChoice(choice: Choice) {
    if (gameState.value !== 'play' || !currentQuestion.value || isAdvancing.value)
      return

    isAdvancing.value = true

    if (!choice.isCorrect)
      wrongQuestions.value.push(currentQuestion.value)

    choice.selected = true
    showOverlay.value = true

    setTimeout(() => {
      index.value += 1
      showOverlay.value = false
      isAdvancing.value = false

      if (index.value >= questions.value.length)
        gameState.value = 'end'
    }, ADVANCE_DELAY)
  }

  function resetRun() {
    questions.value = shuffle(gameCountries)
    index.value = 0
    wrongQuestions.value = []
    elapsedSeconds.value = 0
    isAdvancing.value = false
    showOverlay.value = false
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

  function reviewWrongFlags() {
    if (!wrongQuestions.value.length)
      return

    questions.value = shuffle([...wrongQuestions.value])
    index.value = 0
    wrongQuestions.value = []
    elapsedSeconds.value = 0
    isAdvancing.value = false
    showOverlay.value = false
    gameState.value = 'play'
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
    showOverlay,
    questions,
    index,
    wrongQuestions,
    elapsedSeconds,
    timerLabel,
    isFinished,
    currentQuestion,
    totalQuestions,
    totalCorrectQuestions,
    choices,
    startGame,
    pauseGame,
    resumeGame,
    selectChoice,
    stopToStart,
    reviewWrongFlags,
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
