<script setup lang="ts">
interface PlayHeaderPopulationProps {
  regionTitle: string
  countries: Country[]
}

const props = defineProps<PlayHeaderPopulationProps>()

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const populationList = computed(() => {
  return props.countries
    .toSorted((a, b) => b.population - a.population)
})

const totalPopulation = computed(() => {
  return props.countries.reduce((sum, country) => sum + country.population, 0)
})

const countLabel = computed(() => {
  return compactFormatter.format(totalPopulation.value)
})

const modalTitle = computed(() => {
  return `Population of ${props.regionTitle}`
})

const modalDescription = computed(() => {
  return `A breakdown of population figures of ${props.regionTitle}`
})
</script>

<template>
  <PlayHeaderStatOverlay
    icon="i-tabler-user-filled"
    :value="countLabel"
    label="Population"
    :title="modalTitle"
    :description="modalDescription"
    :items="populationList"
    :description-resolver="country => compactFormatter.format(country.population)"
  />
</template>
