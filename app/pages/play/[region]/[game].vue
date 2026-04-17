<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()
const game = String(route.params.game ?? '').toLowerCase()
const gameMode = useRouteQuery<GameMode>('mode', 'multiple-choice')

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

const regionTitle = computed(() => formatRegionTitle(currentRegion.slug))

const pageTitle = computed(() => `${currentGame.title} | Flags of ${regionTitle.value}`)
const pageDescription = computed(() => currentRegion.description)

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
          :game-mode
          :game-countries="currentGame.countries"
          :game-title="currentGame.title"
          :game-slug="currentGame.slug"
          :region-title="`Flags of ${regionTitle}`"
          :region-slug="currentRegion.slug"
          @back="onBack"
        />

        <GameScoreboard
          :region-slug="currentRegion.slug"
          :game-slug="currentGame.slug"
          :game-mode
        />
      </ClientOnly>
    </UPageBody>
  </UPage>
</template>
