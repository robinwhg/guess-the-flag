<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()

const currentRegion = playableRegions.find(playableRegion => playableRegion.slug === region)

if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Region not found',
  })
}

updateAppConfig({
  ui: {
    colors: {
      primary: currentRegion.color,
    },
  },
})

const regionTitle = computed(() => {
  if (currentRegion.slug === 'world')
    return 'the World'

  if (currentRegion.slug === 'americas')
    return 'the Americas'

  return currentRegion.title
})

type Scope = 'countries' | 'territories' | 'both'
const scopeOptions: Array<{ value: Scope, label: string, description: string }> = [
  {
    value: 'countries',
    label: 'Countries',
    description: 'Only sovereign states. Best if you want the standard country-flag challenge.',
  },
  {
    value: 'territories',
    label: 'Territories',
    description: 'Overseas regions and dependencies. Trickier, with many less-familiar or similar-looking flags.',
  },
  {
    value: 'both',
    label: 'Both',
    description: 'Sovereign states and territories in one pool for the broadest and most difficult run.',
  },
]
const scopeQuery = useRouteQuery<Scope>('scope', 'countries')

// TODO: Include info section in the footer of the header with number of countries, number of regions, population and area. Clicking on the info card will open a modal on desktop and a drawer on mobile that shows a list with the info split out into the countries
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="space-y-8">
        <UPageHeader
          :title="`Flags of ${regionTitle}`"
          :description="`Tune your challenge, press Start, and race through the flags of ${regionTitle}.`"
        >
          <template #headline>
            Let's guess
          </template>
        </UPageHeader>

        <URadioGroup
          v-model="scopeQuery"
          legend="Include in game"
          :items="scopeOptions"
          variant="card"
          indicator="hidden"
          :ui="{ label: 'text-left', description: 'text-left', fieldset: 'flex-col sm:flex-row' }"
        />

        <div class="inline-flex justify-end w-full">
          <UButton label="Start Quiz" />
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
