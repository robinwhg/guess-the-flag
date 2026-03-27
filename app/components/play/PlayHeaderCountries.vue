<script setup lang="ts">
interface PlayHeaderCountriesProps {
  regionTitle: string
  countries: Country[]
}

const props = defineProps<PlayHeaderCountriesProps>()

const integerFormatter = new Intl.NumberFormat('en-US')

const countriesList = computed(() => {
  return props.countries
    .filter(country => country.independent)
    .toSorted((a, b) => a.name.common.localeCompare(b.name.common))
})

const countLabel = computed(() => {
  return integerFormatter.format(countriesList.value.length)
})

const modalTitle = computed(() => {
  return `Countries of ${props.regionTitle}`
})

const modalDescription = computed(() => {
  return `All sovereign and independent countries of ${props.regionTitle}`
})
</script>

<template>
  <PlayHeaderStatOverlay
    icon="i-tabler-flag-filled"
    :value="countLabel"
    label="Countries"
    :title="modalTitle"
    :description="modalDescription"
    :items="countriesList"
    :description-resolver="country => country.name.official"
  />
</template>
