<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'flags: flagpedia.net',
    to: 'https://flagpedia.net/',
    target: '_blank',
  },
  {
    label: 'info: restcountries.com',
    to: 'https://restcountries.com/',
    target: '_blank',
  },
]
</script>

<template>
  <UFooter class="text-muted text-sm">
    <template #left>
      <ULink to="https://github.com/robinwhg" target="_blank">
        robinwhg
      </ULink>
    </template>

    <UNavigationMenu :items="items" variant="link" />
  </UFooter>
</template>
