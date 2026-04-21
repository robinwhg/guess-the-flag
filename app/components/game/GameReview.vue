<script setup lang="ts">
const { country } = defineProps<{
  country: Country
}>()

const emit = defineEmits<{
  (e: 'proceed'): void
}>()

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const areaFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
})

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false

  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable
}

onKeyStroke('Enter', (event) => {
  if (isFormField(event.target))
    return

  emit('proceed')
})
</script>

<template>
  <GameStateLayout :content-key="`${country.cca3}-review`" fixed-card>
    <template #content>
      <div class="h-48 lg:h-80">
        <div class="grid grid-cols-2 gap-4">
          <div class="inline-flex justify-between items-center w-full col-span-2 mb-4">
            <UPageFeature :title="country.name.common" :description="country.name.official" class="flex-1" :ui="{ description: 'hidden sm:block' }" />

            <GameImage :src="country.flag.svg" :alt="country.flag.alt" class="h-12! w-min" />
          </div>

          <UPageFeature :title="country.region" description="Region" icon="i-tabler-world" />
          <UPageFeature v-if="country.subregion" :title="country.subregion" description="Subregion" icon="i-tabler-map-pin" />
          <UPageFeature :title="compactFormatter.format(country.population)" description="Population" icon="i-tabler-user" />
          <UPageFeature :title="`${areaFormatter.format(country.area)} km²`" description="Area" icon="i-tabler-ruler-measure" />
        </div>
      </div>
    </template>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <div />

        <BaseCardButton
          color="primary"
          icon="i-tabler-player-track-next-filled"
          label="Next"
          @click="emit('proceed')"
        />
      </div>
    </template>
  </GameStateLayout>
</template>
