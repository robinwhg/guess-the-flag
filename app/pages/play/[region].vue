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

const regionTitle = computed(() => {
  if (currentRegion.slug === 'world') {
    return 'the World'
  }

  if (currentRegion.slug === 'americas') {
    return 'the Americas'
  }

  return currentRegion.slug.charAt(0).toUpperCase() + currentRegion.slug.slice(1)
})

const pageTitle = computed(() => {
  return `Flags of ${regionTitle.value}`
})

const pageDescription = computed(() => {
  return currentRegion.description
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
})

const regionCountries = computed(() => {
  if (currentRegion.slug === 'world') {
    return countries
  }

  return countries.filter(country => country.region.toLowerCase() === currentRegion.slug)
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
const hasStarted = ref(false)

const selectedCountries = computed(() => {
  if (scopeQuery.value === 'countries') {
    return regionCountries.value.filter(country => country.independent)
  }

  if (scopeQuery.value === 'territories') {
    return regionCountries.value.filter(country => !country.independent)
  }

  return regionCountries.value
})

const gameMeta = computed(() => {
  return {
    regionSlug: currentRegion.slug,
    regionName: currentRegion.title,
    gameMode: scopeQuery.value,
  }
})
</script>

<template>
  <UPage>
    <UPageBody>
      <Transition name="fade" mode="out-in">
        <UContainer
          v-if="!hasStarted"
          key="setup"
          class="space-y-8"
        >
          <UPageHeader
            headline="Let's guess"
            :title="pageTitle"
            :description="pageDescription"
          >
            <UPageGrid class="mt-10">
              <PlayHeaderCountries :countries="regionCountries" :region-title="regionTitle" />
              <PlayHeaderTerritories :countries="regionCountries" :region-title="regionTitle" />
              <PlayHeaderPopulation :countries="regionCountries" :region-title="regionTitle" />
            </UPageGrid>
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
            <UButton
              label="Start Quiz"
              icon="i-tabler-player-play-filled"
              :disabled="selectedCountries.length === 0"
              :ui="{ base: 'w-full justify-center sm:w-max sm:justify-start' }"
              @click="hasStarted = true"
            />
          </div>
        </UContainer>

        <UContainer
          v-else
          key="game"
        >
          <Game
            :questions="selectedCountries"
            :game-meta="gameMeta"
            @back="hasStarted = false"
          />
        </UContainer>
      </Transition>
    </UPageBody>
  </UPage>
</template>
