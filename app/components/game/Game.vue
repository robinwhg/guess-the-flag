<script setup lang="ts">
const props = defineProps<{
  config: GameConfig
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { config } = toRefs(props)

const { gameState, choices, retry, selectChoice, typedAnswer, submitTypedAnswer, totalCorrectQuestions, totalQuestions, index, currentQuestion, isAdvancing, showOverlay, timerLabel, elapsedSeconds, startGame, pauseGame, resumeGame, stopToStart, reviewWrongFlags } = useGame(config.value.game.countries)
const { saveScore } = useScoreHistory()
const isReviewRun = ref(false)

watch(gameState, (state, previousState) => {
  if (state !== 'end' || previousState === 'end' || isReviewRun.value)
    return

  if (!totalQuestions.value)
    return

  saveScore({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    regionSlug: config.value.region.slug,
    regionTitle: config.value.region.title,
    gameSlug: config.value.game.slug,
    gameTitle: config.value.game.title,
    totalQuestions: totalQuestions.value,
    totalCorrectQuestions: totalCorrectQuestions.value,
    elapsedSeconds: elapsedSeconds.value,
    gameMode: config.value.game.mode,
  })
})

function onStartGame() {
  isReviewRun.value = false
  startGame()
}

function onRetry() {
  isReviewRun.value = false
  retry()
}

function onStopToStart() {
  isReviewRun.value = false
  stopToStart()
}

function onReviewWrongFlags() {
  isReviewRun.value = true
  reviewWrongFlags()
}

function togglePause() {
  if (gameState.value === 'play') {
    pauseGame()
    return
  }

  if (gameState.value === 'pause')
    resumeGame()
}
</script>

<template>
  <div class="space-y-4">
    <GameHeader
      :current-index="index"
      :total-questions
      :timer-label="timerLabel"
      :is-advancing="isAdvancing"
      :game-state="gameState"
      @toggle-pause="togglePause"
    />

    <Transition name="fade" mode="out-in">
      <GameStart
        v-if="gameState === 'start'"
        :game-title="config.game.title"
        :region-title="config.region.title"
        :total-questions
        :game-mode="config.game.mode"
        @start="onStartGame"
        @back="emit('back')"
      />

      <div v-else-if="gameState === 'play'" class="space-y-4">
        <GamePlay
          v-if="currentQuestion"
          v-model:typed-answer="typedAnswer"
          :current-question
          :choices
          :is-advancing
          :show-overlay
          :game-mode="config.game.mode"
          @select-choice="choice => selectChoice(choice)"
          @submit-typed-answer="submitTypedAnswer"
        />
      </div>

      <div v-else-if="gameState === 'pause'" class="space-y-4">
        <GamePause
          @resume="resumeGame"
          @exit="onStopToStart"
        />
      </div>

      <GameEnd
        v-else
        :total-questions
        :total-correct-questions
        :timer-label
        :game-title="config.game.title"
        :region-title="config.region.title"
        @retry="onRetry"
        @review="onReviewWrongFlags"
        @back="emit('back')"
      />
    </Transition>
  </div>
</template>
