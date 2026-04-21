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
  <img
    :src="src"
    :alt="alt"
    class="mx-auto block h-full w-full object-contain"
    @load="handleImageLoad"
  >
</template>
