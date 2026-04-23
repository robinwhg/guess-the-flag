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
  if (typeof Image === 'undefined')
    return

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
  <div class="relative h-full w-full">
    <USkeleton v-if="!isImageLoaded" class="absolute inset-0 h-full w-full rounded-md" />

    <img
      :src="src"
      :alt="alt"
      decoding="async"
      class="mx-auto block h-full w-full object-contain transition-opacity duration-150"
      :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
      @load="handleImageLoad"
    >
  </div>
</template>
