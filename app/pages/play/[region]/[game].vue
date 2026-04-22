<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()
const game = String(route.params.game ?? '').toLowerCase()
const gameMode = useRouteQuery<GameMode>('mode', 'multiple-choice')
const gameDifficulty = useRouteQuery<GameDifficulty>('difficulty', 'test')

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
const config = computed<GameConfig>(() => ({
  game: {
    slug: currentGame.slug,
    title: currentGame.title,
    countries: currentGame.countries,
    mode: gameMode.value,
    difficulty: gameDifficulty.value,
  },
  region: {
    slug: currentRegion.slug,
    title: `Flags of ${regionTitle.value}`,
  },
}))

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
          :config
          @back="onBack"
        />
      </ClientOnly>
    </UPageBody>
  </UPage>
</template>
