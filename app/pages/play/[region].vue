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
          <PlayHeader
            :region="currentRegion.slug"
            :countries="regionCountries"
          />

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
          <Game
            :questions="selectedCountries"
            @back="hasStarted = false"
          />
        </UContainer>
      </Transition>
    </UPageBody>
  </UPage>
</template>
