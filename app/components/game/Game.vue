<script setup lang="ts">
const props = defineProps<{
  countries: Country[]
  gameTitle: string
  regionTitle: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { countries, gameTitle, regionTitle } = toRefs(props)

const { choices, retry, selectChoice, totalCorrectQuestions, totalQuestions, index, question, isFinished, isPaused, isAdvancing, timerLabel } = useGame(countries.value)
const hasStarted = ref(false)

isPaused.value = true

function startGame() {
  hasStarted.value = true
  isPaused.value = false
}

function stopToStart() {
  retry()
  hasStarted.value = false
  isPaused.value = true
}

// FIXME: Show hint for territories that have the same flag as country
</script>

<template>
  <div>
    <Transition name="fade" mode="out-in">
      <GameStart
        v-if="!hasStarted"
        :game-title="gameTitle"
        :region-title="regionTitle"
        :countries="countries"
        @start="startGame"
        @back="emit('back')"
      />

      <div v-else>
        <Transition name="fade" mode="out-in">
          <div v-if="!isFinished && question" class="space-y-4">
            <GameHeader
              v-model:is-paused="isPaused"
              :current-index="index"
              :total-questions
              :timer-label="timerLabel"
              :is-advancing="isAdvancing"
            />

            <Transition name="fade" mode="out-in">
              <GamePause
                v-if="isPaused"
                @resume="isPaused = false"
                @exit="stopToStart"
              />

              <GamePlay
                v-else
                :question="question"
                :choices="choices"
                :is-advancing="isAdvancing"
                @select-choice="choice => selectChoice(choice)"
              />
            </Transition>
          </div>

          <GameEnd
            v-else
            :total-questions
            :total-correct-questions
            :timer-label="timerLabel"
            @retry="retry"
            @back="emit('back')"
          />
        </Transition>
      </div>
    </Transition>
  </div>
</template>
