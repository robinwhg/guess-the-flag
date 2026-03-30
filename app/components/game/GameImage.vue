<script setup lang="ts">
interface GameImageProps {
  src: string
  alt: string
  preloadSrc?: string
}

const props = defineProps<GameImageProps>()
const { src, alt, preloadSrc } = toRefs(props)

const isImageLoaded = ref(false)

function preloadImage(src: string): void {
  const image = new Image()
  image.src = src
}

function handleImageLoad(): void {
  isImageLoaded.value = true
}

watch(src, () => {
  isImageLoaded.value = false
}, { immediate: true })

watch(preloadSrc, (nextSrc) => {
  if (!nextSrc) {
    return
  }

  preloadImage(nextSrc)
}, { immediate: true })
</script>

<template>
  <UCard :ui="{ root: 'dark:bg-default', body: 'p-4 sm:p-4 relative h-64 lg:h-80' }">
    <USkeleton
      v-if="!isImageLoaded"
      class="absolute inset-0 h-full aspect-3/2"
    />

    <img
      :src="src"
      :alt="alt"
      class="mx-auto h-full w-full object-contain transition-opacity duration-200"
      :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
      @load="handleImageLoad"
    >
  </UCard>
</template>
