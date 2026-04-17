<script setup lang="ts">
const props = defineProps<{
  currentQuestion: Country
  choices: GameChoice[]
  isAdvancing: boolean
  showOverlay: 'none' | 'success' | 'error'
  gameMode: GameMode
}>()

const emit = defineEmits<{
  (e: 'selectChoice', choice: GameChoice): void
  (e: 'submitTypedAnswer'): void
}>()

const typedAnswer = defineModel<string>('typedAnswer', { required: true })

const { currentQuestion, choices, isAdvancing, showOverlay, gameMode } = toRefs(props)

function onSubmitTypedAnswer() {
  emit('submitTypedAnswer')
}
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
      <UInput
        v-if="gameMode === 'type-answer'"
        v-model="typedAnswer" size="xl" variant="soft" placeholder="Enter your answer here..." class="w-full"
        :class="{
          'choice-pop': showOverlay === 'success',
          'choice-wiggle': showOverlay === 'error',
        }"
        :ui="{ base:
          showOverlay === 'success' ? 'text-success bg-success/25 hover:bg-success/25 focus:bg-success/25 disabled:bg-success/25 px-4 py-4'
          : showOverlay === 'error' ? 'text-error bg-error/25 hover:bg-error/25 focus:bg-error/25 disabled:bg-error/25 px-4 py-4'
            : 'px-4 py-4',
        }"
        @keyup.enter="onSubmitTypedAnswer"
      >
        <template #trailing>
          <UButton
            :disabled="!typedAnswer.length"
            color="neutral"
            variant="link"
            icon="i-tabler-arrow-forward"
            aria-label="Clear input"
            :ui="{ leadingIcon:
              showOverlay === 'success' ? 'text-success'
              : showOverlay === 'error' ? 'text-error'
                : '',
            }"
            @click="onSubmitTypedAnswer"
          />
        </template>
      </UInput>

      <div v-else :key="`choices-${currentQuestion.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
        <div
          v-for="choice in choices" :key="choice.country.cca3" class="relative"
          :class="{
            'choice-pop': showOverlay === 'success' && choice.selected,
            'choice-wiggle': showOverlay === 'error' && choice.selected,
          }"
        >
          <BaseCardButton
            :disabled="isAdvancing"
            :label="choice.country.name.common"
            @click="emit('selectChoice', choice)"
          />

          <Transition name="fade" mode="out-in">
            <div
              v-if="showOverlay !== 'none' && choice.selected"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
              :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
            >
              <UIcon
                class="size-10"
                :name="
                  showOverlay === 'success' ? 'i-tabler-check'
                  : showOverlay === 'error' ? 'i-tabler-x'
                    : ''
                "
              />
            </div>
          </Transition>
        </div>
      </div>
    </template>
  </GameStateLayout>
</template>
