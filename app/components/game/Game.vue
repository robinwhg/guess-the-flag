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

const game: GameRuntime = {
  ...baseGame,
  startGame: () => {
    isReviewRun.value = false
    baseGame.startGame()
  },
  retry: () => {
    isReviewRun.value = false
    baseGame.retry()
  },
  stopToStart: () => {
    isReviewRun.value = false
    baseGame.stopToStart()
  },
  reviewWrongFlags: () => {
    isReviewRun.value = true
    baseGame.reviewWrongFlags()
  },
}

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

      <div v-else-if="game.gameState.value === 'play'" class="space-y-4">
        <GamePlay
          v-if="game.currentQuestion.value"
          :game
          :config
        />
      </div>

      <div v-else-if="game.gameState.value === 'pause'" class="space-y-4">
        <GamePause :game />
      </div>

      <GameEnd
        v-else
        :game
        :config
        @back="emit('back')"
      />
    </Transition>
  </div>
</template>
