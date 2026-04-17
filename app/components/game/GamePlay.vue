<script setup lang="ts">
const { game, config } = defineProps<{
  game: GameRuntime
  config: GameConfig
}>()

const currentQuestion = computed(() => game.currentQuestion.value!)

function onSubmitTypedAnswer() {
  game.submitTypedAnswer()
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
        v-if="config.game.mode === 'type-answer'"
        :model-value="game.typedAnswer.value"
        size="xl"
        variant="soft"
        placeholder="Enter your answer here..."
        class="w-full"
        :class="{
          'choice-pop': game.showOverlay.value === 'success',
          'choice-wiggle': game.showOverlay.value === 'error',
        }"
        :ui="{ base:
          game.showOverlay.value === 'success' ? 'text-success bg-success/25 hover:bg-success/25 focus:bg-success/25 disabled:bg-success/25 px-4 py-4'
          : game.showOverlay.value === 'error' ? 'text-error bg-error/25 hover:bg-error/25 focus:bg-error/25 disabled:bg-error/25 px-4 py-4'
            : 'px-4 py-4',
        }"
        @update:model-value="value => game.setTypedAnswer(String(value ?? ''))"
        @keyup.enter="onSubmitTypedAnswer"
      >
        <template #trailing>
          <UButton
            :disabled="!game.typedAnswer.value.length"
            color="neutral"
            variant="link"
            icon="i-tabler-arrow-forward"
            aria-label="Clear input"
            :ui="{ leadingIcon:
              game.showOverlay.value === 'success' ? 'text-success'
              : game.showOverlay.value === 'error' ? 'text-error'
                : '',
            }"
            @click="onSubmitTypedAnswer"
          />
        </template>
      </UInput>

      <div v-else :key="`choices-${currentQuestion.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
        <div
          v-for="choice in game.choices.value" :key="choice.country.cca3" class="relative"
          :class="{
            'choice-pop': game.showOverlay.value === 'success' && choice.selected,
            'choice-wiggle': game.showOverlay.value === 'error' && choice.selected,
          }"
        >
          <BaseCardButton
            :disabled="game.isAdvancing.value"
            :label="choice.country.name.common"
            @click="game.selectChoice(choice)"
          />

          <Transition name="fade" mode="out-in">
            <div
              v-if="game.showOverlay.value !== 'none' && choice.selected"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
              :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
            >
              <UIcon
                class="size-10"
                :name="
                  game.showOverlay.value === 'success' ? 'i-tabler-check'
                  : game.showOverlay.value === 'error' ? 'i-tabler-x'
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
