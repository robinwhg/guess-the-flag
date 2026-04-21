<script setup lang="ts">
defineProps<{
  feedback: 'none' | 'success' | 'error'
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const typedAnswer = defineModel<string>({ default: '' })
</script>

<template>
  <UInput
    v-model="typedAnswer"
    autofocus
    size="xl"
    variant="soft"
    placeholder="Enter your answer here..."
    class="w-full"
    :class="{
      'choice-pop': feedback === 'success',
      'choice-wiggle': feedback === 'error',
    }"
    :ui="{ base:
      feedback === 'success' ? 'text-success bg-success/25 hover:bg-success/25 focus:bg-success/25 disabled:bg-success/25 px-4 py-4'
      : feedback === 'error' ? 'text-error bg-error/25 hover:bg-error/25 focus:bg-error/25 disabled:bg-error/25 px-4 py-4'
        : 'px-4 py-4',
    }"
    @keyup.enter="emit('submit')"
  >
    <template #trailing>
      <UButton
        :disabled="!typedAnswer.length || disabled"
        color="neutral"
        variant="link"
        icon="i-tabler-arrow-forward"
        aria-label="Clear input"
        :ui="{ leadingIcon:
          feedback === 'success' ? 'text-success'
          : feedback === 'error' ? 'text-error'
            : '',
        }"
        @click="emit('submit')"
      />
    </template>
  </UInput>
</template>
