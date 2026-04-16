<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()
const game = String(route.params.game ?? '').toLowerCase()

const currentRegion = playableRegions.find(playableRegion => playableRegion.slug === region)

if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Region not found',
  })
}

const currentGame = currentRegion.games.find(playableGame => playableGame.slug === game)

if (!currentGame) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Game not found',
  })
}

const regionTitle = computed(() => {
  if (currentRegion.slug === 'world')
    return 'the World'

  if (currentRegion.slug === 'americas')
    return 'the Americas'

  return currentRegion.slug.charAt(0).toUpperCase() + currentRegion.slug.slice(1)
})

const pageTitle = computed(() => `${currentGame.title} | Flags of ${regionTitle.value}`)
const pageDescription = computed(() => currentRegion.description)
const gameCountries = computed(() => [...currentGame.countries])

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
})

function onBack() {
  return navigateTo(`/${currentRegion?.slug}`)
}
</script>

<template>
  <UPage>
    <UPageBody>
      <ClientOnly>
        <Game
          :countries="gameCountries"
          :game-title="currentGame.title"
          :game-slug="currentGame.slug"
          :region-title="`Flags of ${regionTitle}`"
          :region-slug="currentRegion.slug"
          @back="onBack"
        />

        <GameScoreboard
          :region-slug="currentRegion.slug"
          :game-slug="currentGame.slug"
        />
      </ClientOnly>
    </UPageBody>
  </UPage>
</template>
