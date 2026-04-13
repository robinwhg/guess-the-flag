<script setup lang="ts">
const items = computed(() => {
  return playableRegions.map(region => ({
    label: region.title,
    to: `/${region.slug}`,
  }))
})
</script>

<template>
  <UHeader toggle-side="right">
    <template #title>
      <UIcon name="i-tabler-globe-filled" class="size-8 text-primary" />
      <span>Guess the Flag</span>
    </template>

    <UNavigationMenu :items />

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-tabler-brand-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/robinwhg/guess-the-flag"
        target="_blank"
        aria-label="GitHub"
      />
    </template>

    <template #body>
      <UNavigationMenu orientation="vertical" :items />
    </template>
  </UHeader>
</template>
