<template>
  <div class="space-y-8">
    <p v-if="$slots.title" class="text-xl font-semibold">
      <slot name="title" />
    </p>

    <div class="max-w-2xl mx-auto space-y-4">
      <Transition name="slide-side" mode="out-in" appear>
        <slot name="content" />
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
