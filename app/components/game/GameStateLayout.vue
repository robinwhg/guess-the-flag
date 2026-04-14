<script setup lang="ts">
const props = withDefaults(defineProps<{
  contentKey?: string
}>(), {
  contentKey: 'default',
})

const { contentKey } = toRefs(props)
</script>

<template>
  <div class="space-y-4">
    <div class="max-w-2xl mx-auto space-y-4">
      <Transition name="slide-side" mode="out-in" appear>
        <UCard :key="contentKey" :ui="{ body: 'p-4 sm:p-4 relative h-64 lg:h-80' }">
          <slot name="content" />
        </UCard>
      </Transition>

      <Transition
        v-if="$slots.actions"
        name="slide-up"
        mode="out-in"
        appear
      >
        <slot name="actions" />
      </Transition>
    </div>
  </div>
</template>
