<script setup lang="ts">
type CardButtonColor = 'neutral' | 'primary'

interface BaseCardButtonProps {
  disabled?: boolean
  color?: CardButtonColor
  icon?: string
  label?: string
}

const props = withDefaults(defineProps<BaseCardButtonProps>(), {
  disabled: false,
  color: 'neutral',
  icon: undefined,
  label: undefined,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const { disabled, color, icon, label } = toRefs(props)

function handleClick(event: MouseEvent): void {
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    class="block h-full w-full text-left disabled:cursor-not-allowed"
    :disabled="disabled"
    :aria-label="label"
    @click="handleClick"
  >
    <UCard
      :ui="color === 'primary'
        ? { root: 'h-24 cursor-pointer flex p-1 sm:p-1 bg-primary hover:bg-primary/75', body: 'flex-1 flex items-center justify-center gap-2 text-inverted' }
        : { root: 'h-24 cursor-pointer flex p-1 sm:p-1 hover:bg-elevated', body: 'flex-1 flex items-center justify-center gap-2' }"
    >
      <template v-if="icon || label">
        <UIcon v-if="icon" :name="icon" class="size-6 shrink-0" />
        <p v-if="label" class="line-clamp-3 text-center text-base font-semibold sm:text-xl">
          {{ label }}
        </p>
      </template>

      <slot v-else />
    </UCard>
  </button>
</template>
