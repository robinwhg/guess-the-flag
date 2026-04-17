<script setup lang="ts">
const props = defineProps<{
  currentQuestion: Country
  choices: Choice[]
  isAdvancing: boolean
  showOverlay: boolean
}>()

const emit = defineEmits<{
  (e: 'selectChoice', choice: Choice): void
}>()

const { currentQuestion, choices, isAdvancing, showOverlay } = toRefs(props)
</script>

<template>
  <GameStateLayout :content-key="currentQuestion.cca3">
    <template #content>
      <div class="flex h-full flex-col gap-1">
        <GameImage
          :key="currentQuestion.cca3"
          :src="currentQuestion.flag.svg"
          :alt="currentQuestion.flag.alt"
          class="min-h-0"
        />

        <p v-if="currentQuestion.hint" class="text-muted">
          Hint: {{ currentQuestion.hint }}
        </p>
      </div>
    </template>

    <template #actions>
      <div :key="`choices-${currentQuestion.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
        <div
          v-for="choice in choices" :key="choice.country.cca3" class="relative"
          :class="{
            'choice-wiggle': showOverlay && choice.selected && !choice.isCorrect,
            'choice-pop': showOverlay && choice.selected && choice.isCorrect,
          }"
        >
          <BaseCardButton
            :disabled="isAdvancing"
            :label="choice.country.name.common"
            @click="emit('selectChoice', choice)"
          />

          <Transition name="fade" mode="out-in">
            <div
              v-if="showOverlay && choice.selected"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
              :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
            >
              <UIcon :name="choice.isCorrect ? 'i-tabler-check' : 'i-tabler-x'" class="size-10" />
            </div>
          </Transition>
        </div>
      </div>
    </template>
  </GameStateLayout>
</template>
