type GameMode = 'countries' | 'territories' | 'both'

interface GameMeta {
  regionSlug: string
  regionName: string
  gameMode: GameMode
}

interface UseGameSessionConfig {
  questions: Country[]
  gameMeta: GameMeta
}

export function useGameSession(config: UseGameSessionConfig) {
  const isPaused = ref(false)
  const selectedChoiceCode = ref<string | null>(null)
  const isRevealed = ref(false)
  const elapsedSeconds = ref(0)
  const correctCount = ref(0)
  const finishedAt = ref<string | null>(null)
  const runId = ref(createRunId())
  const questionQueue = ref<Country[]>(shuffle([...config.questions]))

  const CHOICE_COUNT = 4
  const ADVANCE_DELAY_MS = 600

  const currentIndex = ref(0)
  let advanceTimeout: ReturnType<typeof setTimeout> | null = null
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const totalQuestions = computed(() => {
    return questionQueue.value.length
  })

  const isCompleted = computed(() => {
    return totalQuestions.value > 0 && currentIndex.value >= totalQuestions.value
  })

  const currentQuestionNumber = computed(() => {
    if (totalQuestions.value === 0) {
      return 0
    }

    return Math.min(currentIndex.value + 1, totalQuestions.value)
  })

  const answeredQuestions = computed(() => {
    return Math.min(currentIndex.value, totalQuestions.value)
  })

  const displayAnsweredQuestions = computed(() => {
    const revealedOffset = isRevealed.value ? 1 : 0

    return Math.min(answeredQuestions.value + revealedOffset, totalQuestions.value)
  })

  const currentQuestion = computed(() => {
    return questionQueue.value[currentIndex.value] ?? null
  })

  const nextQuestion = computed(() => {
    return questionQueue.value[currentIndex.value + 1] ?? null
  })

  const choices = computed(() => {
    if (!currentQuestion.value) {
      return [] as Country[]
    }

    const correct = currentQuestion.value
    const distractors = shuffle(config.questions.filter(country => country.cca2 !== correct.cca2)).slice(0, CHOICE_COUNT - 1)

    return shuffle([correct, ...distractors]).slice(0, CHOICE_COUNT)
  })

  const runResult = computed(() => {
    if (!finishedAt.value) {
      return null
    }

    return {
      runId: runId.value,
      regionSlug: config.gameMeta.regionSlug,
      regionName: config.gameMeta.regionName,
      gameMode: config.gameMeta.gameMode,
      totalQuestions: totalQuestions.value,
      correctCount: correctCount.value,
      durationMs: elapsedSeconds.value * 1000,
      finishedAt: finishedAt.value,
    }
  })

  const isErrorFeedbackActive = computed(() => {
    if (!isRevealed.value || !selectedChoiceCode.value || !currentQuestion.value) {
      return false
    }

    return selectedChoiceCode.value !== currentQuestion.value.cca2
  })

  const viewState = computed<'paused' | 'completed' | 'playing'>(() => {
    if (runResult.value) {
      return 'completed'
    }

    if (isPaused.value) {
      return 'paused'
    }

    return 'playing'
  })

  function resetSession(): void {
    clearAdvanceTimeout()
    clearTimerInterval()
    currentIndex.value = 0
    elapsedSeconds.value = 0
    correctCount.value = 0
    finishedAt.value = null
    runId.value = createRunId()
    resetQuestionQueue()
    resetChoiceState()
    isPaused.value = false
  }

  function resetQuestionQueue(): void {
    questionQueue.value = shuffle([...config.questions])
  }

  function clearTimerInterval(): void {
    if (!timerInterval) {
      return
    }

    clearInterval(timerInterval)
    timerInterval = null
  }

  function startTimerInterval(): void {
    if (timerInterval || isPaused.value || !currentQuestion.value) {
      return
    }

    timerInterval = setInterval(() => {
      elapsedSeconds.value += 1
    }, 1000)
  }

  function clearAdvanceTimeout(): void {
    if (!advanceTimeout) {
      return
    }

    clearTimeout(advanceTimeout)
    advanceTimeout = null
  }

  function resetChoiceState(): void {
    selectedChoiceCode.value = null
    isRevealed.value = false
  }

  function isSelectedChoice(choice: Country): boolean {
    return selectedChoiceCode.value === choice.cca2
  }

  function isCorrectChoice(choice: Country): boolean {
    return currentQuestion.value?.cca2 === choice.cca2
  }

  function showSuccessOverlay(choice: Country): boolean {
    return isRevealed.value && isSelectedChoice(choice) && isCorrectChoice(choice)
  }

  function showErrorOverlay(choice: Country): boolean {
    return isRevealed.value && isSelectedChoice(choice) && !isCorrectChoice(choice)
  }

  function selectChoice(choice: Country): void {
    if (!currentQuestion.value || isPaused.value || isRevealed.value) {
      return
    }

    selectedChoiceCode.value = choice.cca2
    isRevealed.value = true

    if (isCorrectChoice(choice)) {
      correctCount.value += 1
    }

    clearAdvanceTimeout()
    advanceTimeout = setTimeout(() => {
      currentIndex.value += 1
      resetChoiceState()
      advanceTimeout = null
    }, ADVANCE_DELAY_MS)
  }

  function resume(): void {
    isPaused.value = false
  }

  function retry(): void {
    resetSession()
  }

  function resetForExit(): void {
    resetSession()
  }

  watch([isPaused, currentQuestion], ([paused, question]) => {
    if (paused || !question) {
      clearTimerInterval()
      return
    }

    startTimerInterval()
  }, { immediate: true })

  watch(isCompleted, (completed) => {
    if (!completed || finishedAt.value) {
      return
    }

    finishedAt.value = new Date().toISOString()
    isPaused.value = false
  })

  watch(
    () => [config.questions, config.gameMeta.regionSlug, config.gameMeta.regionName, config.gameMeta.gameMode],
    () => {
      resetSession()
    },
  )

  onBeforeUnmount(() => {
    clearAdvanceTimeout()
    clearTimerInterval()
  })

  return {
    isPaused,
    isRevealed,
    elapsedSeconds,
    totalQuestions,
    currentQuestionNumber,
    answeredQuestions,
    displayAnsweredQuestions,
    currentQuestion,
    nextQuestion,
    choices,
    isCompleted,
    viewState,
    isErrorFeedbackActive,
    runResult,
    showSuccessOverlay,
    showErrorOverlay,
    selectChoice,
    resume,
    retry,
    resetForExit,
  }
}

function createRunId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = current
  }

  return shuffled
}
