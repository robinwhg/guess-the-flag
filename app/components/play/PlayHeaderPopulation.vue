<script setup lang="ts">
interface PlayHeaderPopulationProps {
  regionTitle: string
  countries: Country[]
}

const props = defineProps<PlayHeaderPopulationProps>()
const { regionTitle, countries } = toRefs(props)

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const populationList = computed(() => {
  return countries.value
    .toSorted((a, b) => b.population - a.population)
})

const totalPopulation = computed(() => {
  return countries.value.reduce((sum, country) => sum + country.population, 0)
})

const countLabel = computed(() => {
  return compactFormatter.format(totalPopulation.value)
})

const modalTitle = computed(() => {
  return `Population of ${regionTitle.value}`
})

const modalDescription = computed(() => {
  return `A breakdown of population figures of ${regionTitle.value}`
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
