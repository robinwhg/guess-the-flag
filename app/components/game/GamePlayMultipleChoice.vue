<script setup lang="ts">
const props = defineProps<{
  choices: GameChoice[]
  feedback: 'none' | 'success' | 'error'
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'select', choice: GameChoice): void
}>()

const { choices, disabled } = toRefs(props)

const KEY_TO_CHOICE_INDEX: Record<string, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  q: 0,
  w: 1,
  e: 2,
  r: 3,
  h: 0,
  j: 1,
  k: 2,
  l: 3,
}

onKeyStroke((event) => {
  if (event.repeat || disabled.value)
    return

  const index = KEY_TO_CHOICE_INDEX[event.key.toLowerCase()]

  if (index === undefined)
    return

  const selectedChoice = choices.value[index]

  if (!selectedChoice)
    return

  emit('select', selectedChoice)
})
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
