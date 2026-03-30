<script setup lang="ts">
type GameMode = 'countries' | 'territories' | 'both'

interface GameMeta {
  regionSlug: string
  regionName: string
  gameMode: GameMode
}

interface FlagQuizGameProps {
  questions: Country[]
  gameMeta: GameMeta
}

const props = defineProps<FlagQuizGameProps>()

const emit = defineEmits<{
  back: []
}>()

const gameSession = reactive(useGameSession(props))

function handleExit(): void {
  gameSession.resetForExit()
  emit('back')
}

watch(
  () => [props.questions, props.gameMeta.regionSlug, props.gameMeta.regionName, props.gameMeta.gameMode],
  () => {
    handleExit()
  },
)

// FIXME: Hint for territories that have the same flag as country
// FIXME: Alt text of images shouldn't have the name of the country in it
// TODO: Stop timer at 60m & after 5m of inactivity pause
// TODO: Setup choices pool to have closely related options
</script>

<template>
  <section class="space-y-4">
    <Transition name="fade" mode="out-in">
      <GameHeader
        v-if="gameSession.viewState !== 'completed'"
        v-model:paused="gameSession.isPaused"
        :state="{
          currentQuestionNumber: gameSession.currentQuestionNumber,
          answeredQuestions: gameSession.displayAnsweredQuestions,
          totalQuestions: gameSession.totalQuestions,
          elapsedSeconds: gameSession.elapsedSeconds,
          isErrorFeedbackActive: gameSession.isErrorFeedbackActive,
        }"
      />
    </Transition>

    <Transition name="fade" mode="out-in">
      <GamePause
        v-if="gameSession.viewState === 'paused'"
        key="paused"
        @resume="gameSession.resume"
        @exit="handleExit"
      />

      <GameEndCard
        v-else-if="gameSession.viewState === 'completed' && gameSession.runResult"
        key="completed"
        :result="gameSession.runResult"
        @retry="gameSession.retry"
        @back="handleExit"
      />

      <div
        v-else-if="gameSession.currentQuestion"
        key="playing"
        class="space-y-12"
      >
        <div class="space-y-4 max-w-2xl mx-auto">
          <Transition name="slide-side" mode="out-in" appear>
            <GameImage
              :key="gameSession.currentQuestion.cca2"
              :src="gameSession.currentQuestion.flag.svg"
              :alt="gameSession.currentQuestion.flag.alt"
              :preload-src="gameSession.nextQuestion?.flag.svg"
            />
          </Transition>

          <Transition name="slide-up" mode="out-in" appear>
            <div :key="`choices-${gameSession.currentQuestion.cca2}`" class="grid grid-cols-2 items-stretch gap-4">
              <div
                v-for="choice in gameSession.choices"
                :key="choice.cca2"
                class="relative"
                :class="{
                  'choice-wiggle': gameSession.showErrorOverlay(choice),
                  'choice-pop': gameSession.showSuccessOverlay(choice),
                }"
              >
                <BaseCardButton
                  :label="choice.name.common"
                  :disabled="gameSession.isRevealed"
                  @click="gameSession.selectChoice(choice)"
                />

                <Transition name="fade">
                  <div
                    v-if="gameSession.showSuccessOverlay(choice)"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-success text-inverted pointer-events-none"
                  >
                    <UIcon name="i-tabler-check" class="size-10" />
                  </div>

                  <div
                    v-else-if="gameSession.showErrorOverlay(choice)"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-error text-inverted pointer-events-none"
                  >
                    <UIcon name="i-tabler-x" class="size-10" />
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </section>
</template>
