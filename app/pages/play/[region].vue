<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()

const currentRegion = playableRegions.find(playableRegion => playableRegion.slug === region)

if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Region not found',
  })
}

const regionTitle = computed(() => {
  if (currentRegion.slug === 'world')
    return 'the World'

  if (currentRegion.slug === 'americas')
    return 'the Americas'

  return currentRegion.slug.charAt(0).toUpperCase() + currentRegion.slug.slice(1)
})

const pageTitle = computed(() => `Flags of ${regionTitle.value}`)

const pageDescription = computed(() => currentRegion.description)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
})

const regionCountries = computed(() => {
  if (currentRegion.slug === 'world')
    return countries

  return countries.filter(country => country.region.toLowerCase() === currentRegion.slug)
})

const selectedCountries = computed(() => {
  return regionCountries.value
})

const hasStarted = ref(false)
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <Transition name="fade" mode="out-in">
          <div
            v-if="!hasStarted"
            class="flex flex-col gap-8"
          >
            <PlayHeader
              :title="pageTitle"
              :description="pageDescription"
              :countries="regionCountries"
            />

            <div class="inline-flex justify-end">
              <UButton
                label="Start Quiz"
                icon="i-tabler-player-play-filled"
                :ui="{ base: 'w-full justify-center sm:w-max sm:justify-start' }"
                @click="hasStarted = true"
              />
            </div>
          </div>

          <Game
            v-else
            :countries="selectedCountries"
            @back="hasStarted = false"
          />
        </Transition>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
