<script setup lang="ts">
import { countries as allCountries } from '~/utils/countries'

interface PlayHeaderTerritoriesProps {
  regionTitle: string
  countries: Country[]
}

const props = defineProps<PlayHeaderTerritoriesProps>()
const { regionTitle, countries } = toRefs(props)

const integerFormatter = new Intl.NumberFormat('en-US')

const territoriesList = computed(() => {
  return countries.value
    .filter(country => !country.independent)
    .toSorted((a, b) => a.name.common.localeCompare(b.name.common))
})

const sovereignNameByCode = computed(() => {
  const map = new Map<string, string>()

  for (const country of allCountries) {
    map.set(country.cca3, country.name.common)
  }

  return map
})

const countLabel = computed(() => {
  return integerFormatter.format(territoriesList.value.length)
})

const modalTitle = computed(() => {
  return `Territories of ${regionTitle.value}`
})

const modalDescription = computed(() => {
  return `All overseas regions and dependencies of ${regionTitle.value}`
})

function getSovereignName(country: Country): string {
  if (!country.sovereignState) {
    return 'N/A'
  }

  return sovereignNameByCode.value.get(country.sovereignState) ?? country.sovereignState
}
</script>

<template>
  <PlayHeaderStatOverlay
    icon="i-tabler-flag-3-filled"
    :value="countLabel"
    label="Territories"
    :title="modalTitle"
    :description="modalDescription"
    :items="territoriesList"
    :description-resolver="getSovereignName"
  />
</template>
