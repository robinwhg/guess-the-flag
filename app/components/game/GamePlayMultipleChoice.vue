<script setup lang="ts">
defineProps<{
  choices: GameChoice[]
  feedback: 'none' | 'success' | 'error'
  disabled: boolean
}>()

const emit = defineEmits<{
  select: [choice: GameChoice]
}>()
</script>

<template>
  <div class="grid grid-cols-2 items-stretch gap-4">
    <div
      v-for="choice in choices" :key="choice.country.cca3" class="relative"
      :class="{
        'choice-pop': feedback === 'success' && choice.selected,
        'choice-wiggle': feedback === 'error' && choice.selected,
      }"
    >
      <BaseCardButton
        :disabled="disabled"
        :label="choice.country.name.common"
        @click="emit('select', choice)"
      />

      <Transition name="fade" mode="out-in">
        <div
          v-if="feedback !== 'none' && choice.selected"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
          :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
        >
          <UIcon
            class="size-10"
            :name="
              feedback === 'success' ? 'i-tabler-check'
              : feedback === 'error' ? 'i-tabler-x'
                : ''
            "
          />
        </div>
      </Transition>
    </div>
  </div>
</template>
