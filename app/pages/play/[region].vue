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

const regionCountries = computed(() => {
  if (currentRegion.slug === 'world') {
    return countries
  }

  return countries.filter(country => country.region.toLowerCase() === currentRegion.slug)
})

const countryCount = computed(() => {
  return regionCountries.value.filter(country => country.independent).length
})

const territoryCount = computed(() => {
  return regionCountries.value.filter(country => !country.independent).length
})

const totalPopulation = computed(() => {
  return regionCountries.value.reduce((sum, country) => sum + country.population, 0)
})

const integerFormatter = new Intl.NumberFormat('en-US')
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const infoCards = computed(() => {
  return [
    {
      title: 'Countries',
      value: integerFormatter.format(countryCount.value),
      icon: 'i-tabler-flag',
    },
    {
      title: 'Territories',
      value: integerFormatter.format(territoryCount.value),
      icon: 'i-tabler-flag-3',
    },
    {
      title: 'Population',
      value: compactFormatter.format(totalPopulation.value),
      icon: 'i-tabler-users',
    },
  ]
})

// TODO: Clicking on the info card will open a modal on desktop and a drawer on mobile that shows a list with the info split out into the countries

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

const contextCountries = computed(() => {
  if (scopeQuery.value === 'countries') {
    return countries.filter(country => country.independent)
  }

  if (scopeQuery.value === 'territories') {
    return countries.filter(country => !country.independent)
  }

  return countries
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
            :title="`Flags of ${regionTitle}`"
            :description="`Tune your challenge, press Start, and race through the flags of ${regionTitle}.`"
          >
            <UPageGrid class="mt-10">
              <UPageCard
                v-for="card in infoCards"
                :key="card.title"
                :icon="card.icon"
                :title="card.value"
                :description="card.title"
              />
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
              icon="i-tabler-player-play"
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
          <FlagQuizGame
            :questions="selectedCountries"
            :context="contextCountries"
            @back="hasStarted = false"
          />
        </UContainer>
      </Transition>
    </UPageBody>
  </UPage>
</template>
