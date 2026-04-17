<script setup lang="ts">
const props = defineProps<{
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { config } = toRefs(props)

const game = useGame(config.value.game.countries)
const { saveScore } = useScoreHistory()
const isReviewRun = ref(false)

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

function onStartGame() {
  isReviewRun.value = false
  game.startGame()
}

function onRetry() {
  isReviewRun.value = false
  game.retry()
}

function onStopToStart() {
  isReviewRun.value = false
  game.stopToStart()
}

function onReviewWrongFlags() {
  isReviewRun.value = true
  game.reviewWrongFlags()
}

function onTogglePause() {
  if (game.gameState.value === 'play') {
    game.pauseGame()
    return
  }

  if (game.gameState.value === 'pause')
    game.resumeGame()
}
</script>

<template>
  <div class="space-y-4">
    <GameHeader
      :current-index="game.index.value"
      :total-questions="game.totalQuestions.value"
      :timer-label="game.timerLabel.value"
      :is-advancing="game.isAdvancing.value"
      :game-state="game.gameState.value"
      @toggle-pause="onTogglePause"
    />

    <Transition name="fade" mode="out-in">
      <GameStart
        v-if="game.gameState.value === 'start'"
        :game-title="config.game.title"
        :region-title="config.region.title"
        :total-questions="game.totalQuestions.value"
        :game-mode="config.game.mode"
        @start="onStartGame"
        @back="emit('back')"
      />

      <div v-else-if="game.gameState.value === 'play'" class="space-y-4">
        <GamePlay
          v-if="game.currentQuestion.value"
          v-model:typed-answer="game.typedAnswer.value"
          :current-question="game.currentQuestion.value"
          :choices="game.choices.value"
          :is-advancing="game.isAdvancing.value"
          :show-overlay="game.showOverlay.value"
          :game-mode="config.game.mode"
          @select-choice="choice => game.selectChoice(choice)"
          @submit-typed-answer="game.submitTypedAnswer"
        />
      </div>

      <div v-else-if="game.gameState.value === 'pause'" class="space-y-4">
        <GamePause
          @resume="game.resumeGame"
          @exit="onStopToStart"
        />
      </div>

      <GameEnd
        v-else
        :total-questions="game.totalQuestions.value"
        :total-correct-questions="game.totalCorrectQuestions.value"
        :timer-label="game.timerLabel.value"
        :game-title="config.game.title"
        :region-title="config.region.title"
        @retry="onRetry"
        @review="onReviewWrongFlags"
        @back="emit('back')"
      />
    </Transition>
  </div>
</template>
