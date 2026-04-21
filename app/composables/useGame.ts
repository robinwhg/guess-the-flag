const CHOICE_COUNT = 4
const TIMER_TIMEOUT = 1000
const MAX_ELAPSED_SECONDS = 90 * 60
const COMBINING_MARKS_REGEX = /\p{M}+/gu
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu

export interface GameChoice {
  country: Country
  isCorrect: boolean
  selected: boolean
}

export type GameMode = 'multiple-choice' | 'type-answer'

export type GameDifficulty = 'practice' | 'test'

export interface GameConfig {
  game: {
    slug: string
    title: string
    countries: Country[]
    mode: GameMode
    difficulty: GameDifficulty
  }
  region: {
    slug: string
    title: string
  }
}

export type GameState = 'start' | 'play' | 'pause' | 'end'

export function useGame(gameCountries: Country[]) {
  const gameState = ref<GameState>('start')
  const isTimerPaused = ref(false)
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

  function completeRunIfFinished() {
    if (index.value >= questions.value.length)
      gameState.value = 'end'
  }

  function advanceToNextQuestion() {
    index.value += 1
    completeRunIfFinished()
  }

  function submitSelectedChoice(choice: GameChoice): boolean | null {
    if (gameState.value !== 'play' || !currentQuestion.value)
      return null

    if (!choice.isCorrect)
      wrongQuestions.value.push(currentQuestion.value)

    choice.selected = true

    return choice.isCorrect
  }

  function submitTypedAnswer(answer: string): boolean | null {
    if (gameState.value !== 'play' || !currentQuestion.value)
      return null

    const normalizedTypedAnswer = normalizeTypedAnswer(answer)
    const acceptedAnswers = new Set(
      getCountryNameVariants(currentQuestion.value)
        .map(normalizeTypedAnswer)
        .filter(value => value.length > 0),
    )
    const isCorrect = acceptedAnswers.has(normalizedTypedAnswer)

    if (!isCorrect)
      wrongQuestions.value.push(currentQuestion.value)

    return isCorrect
  }

  function proceedToNextQuestion() {
    if (gameState.value !== 'play' || !currentQuestion.value)
      return

    advanceToNextQuestion()
  }

  function resetRun() {
    questions.value = shuffle(gameCountries)
    index.value = 0
    wrongQuestions.value = []
    elapsedSeconds.value = 0
    isTimerPaused.value = false
  }

  function startGame() {
    gameState.value = questions.value.length > 0 ? 'play' : 'end'
  }

  function pauseGame() {
    if (gameState.value !== 'play')
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
    gameState.value = 'play'
  }

  function stopToStart() {
    resetRun()
    gameState.value = 'start'
  }

  function setTimerPaused(paused: boolean) {
    isTimerPaused.value = paused
  }

  const timer = setInterval(() => {
    if (gameState.value !== 'play' || isTimerPaused.value)
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
    submitSelectedChoice,
    submitTypedAnswer,
    proceedToNextQuestion,
    setTimerPaused,
    stopToStart,
    reviewWrongFlags,
    retry,
  }
}

export type GameRuntime = ReturnType<typeof useGame>

function normalizeTypedAnswer(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS_REGEX, '')
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_REGEX, '')
}

function getCountryNameVariants(country: Country): string[] {
  const nativeNameVariants = country.name.nativeName.flatMap(nativeName => [
    nativeName.common,
    nativeName.official,
  ])

  return [
    country.name.common,
    country.name.official,
    ...nativeNameVariants,
    ...(country.altSpellings ?? []),
  ]
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
