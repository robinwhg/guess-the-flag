<script setup lang="ts">
interface PlayHeaderCountriesProps {
  regionTitle: string
  countries: Country[]
}

const props = defineProps<PlayHeaderCountriesProps>()
const { regionTitle, countries } = toRefs(props)

const integerFormatter = new Intl.NumberFormat('en-US')

const countriesList = computed(() => {
  return countries.value
    .filter(country => country.independent)
    .toSorted((a, b) => a.name.common.localeCompare(b.name.common))
})

const countLabel = computed(() => {
  return integerFormatter.format(countriesList.value.length)
})

const modalTitle = computed(() => {
  return `Countries of ${regionTitle.value}`
})

const modalDescription = computed(() => {
  return `All sovereign and independent countries of ${regionTitle.value}`
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
