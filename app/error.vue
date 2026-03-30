<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
const { error } = toRefs(props)
</script>

<template>
  <UApp>
    <TheHeader />

    <UError :error="error" />

    <TheFooter />
  </UApp>
</template>
