<script setup lang="ts">
interface PlayHeaderCountriesProps {
  title: string
  countries: Country[]
}

const props = defineProps<PlayHeaderCountriesProps>()
const { title, countries } = toRefs(props)

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
  return `Countries of ${title.value}`
})

const modalDescription = computed(() => {
  return `All sovereign and independent countries of ${title.value}`
})
</script>

<template>
  <PlayHeaderCard
    icon="i-tabler-flag"
    :value="countLabel"
    label="Countries"
    :title="modalTitle"
    :description="modalDescription"
    :items="countriesList"
    :description-resolver="(country: Country) => country.name.official"
  />
</template>
