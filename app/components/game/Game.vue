<script setup lang="ts">
const props = defineProps<{
  countries: Country[]
  gameTitle: string
  regionTitle: string
  regionSlug: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { countries, gameTitle, regionTitle } = toRefs(props)

const { gameState, choices, retry, selectChoice, totalCorrectQuestions, totalQuestions, index, question, isAdvancing, timerLabel, startGame, pauseGame, resumeGame, stopToStart } = useGame(countries.value)

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
        :game-title
        :region-title
        :total-questions
        @start="startGame"
        @back="emit('back')"
      />

      <div v-else-if="gameState === 'play'" class="space-y-4">
        <GamePlay
          :question="question!"
          :choices="choices"
          :is-advancing="isAdvancing"
          @select-choice="choice => selectChoice(choice)"
        />
      </div>

      <div v-else-if="gameState === 'pause'" class="space-y-4">
        <GamePause
          @resume="resumeGame"
          @exit="stopToStart"
        />
      </div>

      <GameEnd
        v-else
        :total-questions
        :total-correct-questions
        :timer-label
        :game-title
        :region-title
        @retry="retry"
        @back="emit('back')"
      />
    </Transition>
  </div>
</template>
