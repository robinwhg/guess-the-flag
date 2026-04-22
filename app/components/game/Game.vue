<script setup lang="ts">
const props = defineProps<{
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { config } = toRefs(props)

const baseGame = useGame(config.value.game.countries)
const { saveScore } = useScoreHistory()
const isReviewRun = ref(false)
const showPracticeReview = ref(false)

function resetPracticeReview() {
  showPracticeReview.value = false
}

function proceedToNextQuestion() {
  resetPracticeReview()
  baseGame.proceedToNextQuestion()
}

function onProceed() {
  if (config.value.game.difficulty === 'practice' || isReviewRun.value) {
    showPracticeReview.value = true
    return
  }

  proceedToNextQuestion()
}

const game: GameRuntime = {
  ...baseGame,
  startGame: () => {
    isReviewRun.value = false
    resetPracticeReview()
    baseGame.startGame()
  },
  retry: () => {
    isReviewRun.value = false
    resetPracticeReview()
    baseGame.retry()
  },
  stopToStart: () => {
    isReviewRun.value = false
    resetPracticeReview()
    baseGame.stopToStart()
  },
  reviewWrongFlags: () => {
    isReviewRun.value = true
    resetPracticeReview()
    baseGame.reviewWrongFlags()
  },
}

const hasNextQuestion = computed(() => {
  return game.index.value < game.totalQuestions.value - 1
})

watch(game.gameState, (state) => {
  if (state === 'start' || state === 'end')
    resetPracticeReview()
})

watch(game.gameState, (state, previousState) => {
  if (state !== 'end' || previousState === 'end' || isReviewRun.value)
    return

  if (!game.totalQuestions.value)
    return

  saveScore({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    regionSlug: config.value.region.slug,
    regionTitle: config.value.region.title,
    gameSlug: config.value.game.slug,
    gameTitle: config.value.game.title,
    totalQuestions: game.totalQuestions.value,
    totalCorrectQuestions: game.totalCorrectQuestions.value,
    elapsedSeconds: game.elapsedSeconds.value,
    gameMode: config.value.game.mode,
  })
})
</script>

<template>
  <div class="space-y-4">
    <GameHeader :game />

    <Transition name="fade" mode="out-in">
      <GameStart
        v-if="game.gameState.value === 'start'"
        :game
        :config
        @back="emit('back')"
      />

      <GameReview
        v-else-if="game.gameState.value === 'play' && game.currentQuestion.value && showPracticeReview"
        :country="game.currentQuestion.value"
        :has-next-question="hasNextQuestion"
        @proceed="proceedToNextQuestion"
      />

      <GamePlay
        v-else-if="game.gameState.value === 'play' && game.currentQuestion.value"
        :game
        :config
        @proceed="onProceed"
      />

      <GamePause v-else-if="game.gameState.value === 'pause'" :game />

      <GameEnd
        v-else
        :game
        :config
        @back="emit('back')"
      />
    </Transition>

    <Transition name="slide-up" mode="out-in" appear>
      <Scoreboard
        v-if="game.gameState.value === 'start' || game.gameState.value === 'end'"
        :region-slug="config.region.slug"
        :game-slug="config.game.slug"
        :game-mode="config.game.mode"
      />
    </Transition>
  </div>
</template>
