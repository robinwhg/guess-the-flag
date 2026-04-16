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

const { getScoresForGame } = useScoreHistory()

function getBestScore(gameSlug: string) {
  if (!currentRegion)
    return null

  const scores = getScoresForGame(currentRegion.slug, gameSlug)

  if (!scores.length)
    return null

  return scores.reduce<number>((best, score) => {
    if (!score.totalQuestions)
      return best

    const accuracy = Math.round((score.totalCorrectQuestions / score.totalQuestions) * 100)

    return Math.max(best, accuracy)
  }, 0)
}
</script>

<template>
  <UPage>
    <PlayHeader
      :title="pageTitle"
      :description="pageDescription"
      :countries="regionCountries"
    />

    <UPageBody>
      <div class="flex flex-col gap-8">
        <p class="text-xl font-semibold">
          Select a game to play:
        </p>
        <UPageGrid>
          <UPageCard
            v-for="game in currentRegion.games"
            :key="game.slug"
            :title="game.title"
            :to="`/play/${currentRegion.slug}/${game.slug}`"
            class="transition-transform hover:scale-105"
            orientation="horizontal"
            :ui="{ container: 'grid grid-cols-4 lg:grid-cols-4 items-center', wrapper: 'col-span-3' }"
          >
            <template #leading>
              <p class="text-sm text-primary font-semibold">
                {{ game.countries.length.toString() }} Flags
              </p>
            </template>

            <span v-if="getBestScore(game.slug) !== null" class="text-xl font-semibold text-muted">
              {{ getBestScore(game.slug) }} %
            </span>
          </UPageCard>
        </UPageGrid>
      </div>
    </UPageBody>
  </UPage>
</template>
