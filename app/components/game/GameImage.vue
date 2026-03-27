<script setup lang="ts">
interface GameImageProps {
  src: string
  alt: string
  preloadSrc?: string
}

const props = defineProps<GameImageProps>()

const isImageLoaded = ref(false)

function preloadImage(src: string): void {
  const image = new Image()
  image.src = src
}

function handleImageLoad(): void {
  isImageLoaded.value = true
}

watch(() => props.src, () => {
  isImageLoaded.value = false
}, { immediate: true })

watch(() => props.preloadSrc, (src) => {
  if (!src) {
    return
  }

  preloadImage(src)
}, { immediate: true })
</script>

<template>
  <div class="relative h-64 lg:h-80 flex p-4">
    <USkeleton
      v-if="!isImageLoaded"
      class="absolute inset-0 h-full w-full"
    />

    <img
      :src="props.src"
      :alt="props.alt"
      class="mx-auto h-full w-full object-contain transition-opacity duration-200"
      :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
      @load="handleImageLoad"
    >
  </div>
</template>
