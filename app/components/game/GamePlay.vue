<script setup lang="ts">
const props = defineProps<{
  question: Country
  choices: Choice[]
  isAdvancing: boolean
}>()

const emit = defineEmits<{
  (e: 'selectChoice', choice: Choice): void
}>()

const { question, choices, isAdvancing } = toRefs(props)
</script>

<template>
  <GameStateLayout :content-key="question.cca3">
    <template #content>
      <div class="flex h-full flex-col gap-1">
        <GameImage
          :key="question.cca3"
          :src="question.flag.svg"
          :alt="question.flag.alt"
          class="min-h-0"
        />

        <p v-if="question.hint" class="text-muted">
          Hint: {{ question.hint }}
        </p>
      </div>
    </template>

    <template #actions>
      <div :key="`choices-${question.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
        <div
          v-for="choice in choices" :key="choice.country.cca3" class="relative"
          :class="{
            'choice-wiggle': choice.showOverlay.value && !choice.isCorrect,
            'choice-pop': choice.showOverlay.value && choice.isCorrect,
          }"
        >
          <BaseCardButton
            :disabled="isAdvancing"
            :label="choice.country.name.common"
            @click="emit('selectChoice', choice)"
          />

          <Transition name="fade" mode="out-in">
            <div
              v-if="choice.showOverlay.value"
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
