<script setup lang="ts">
interface PlayHeaderTerritoriesProps {
  title: string
  countries: Country[]
}

const props = defineProps<PlayHeaderTerritoriesProps>()
const { title, countries } = toRefs(props)

const integerFormatter = new Intl.NumberFormat('en-US')

const territoriesList = computed(() => {
  return countries.value
    .filter(country => !country.independent)
    .toSorted((a, b) => a.name.common.localeCompare(b.name.common))
})

const countLabel = computed(() => {
  return integerFormatter.format(territoriesList.value.length)
})

const modalTitle = computed(() => {
  return `Territories of ${title.value}`
})

const modalDescription = computed(() => {
  return `All overseas regions and dependencies of ${title.value}`
})

function getSovereignName(country: Country): string {
  return getSovereignStateName(country) ?? 'N/A'
}
</script>

<template>
  <PlayHeaderCard
    icon="i-tabler-flag-3"
    :value="countLabel"
    label="Territories"
    :title="modalTitle"
    :description="modalDescription"
    :items="territoriesList"
    :description-resolver="getSovereignName"
  />
</template>
