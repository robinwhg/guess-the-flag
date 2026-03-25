<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()

if (!playableRegionSlugs.has(region)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Region not found',
  })
}
</script>

<template>
  <UPage>
    <UPageBody>
      <p>Play region: {{ region }}</p>
    </UPageBody>
  </UPage>
</template>
