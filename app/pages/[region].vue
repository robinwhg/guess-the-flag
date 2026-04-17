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

const regionTitle = computed(() => formatRegionTitle(currentRegion.slug))

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

const gameMode = ref<GameMode>('multiple-choice')

const { getScoresForGame } = useScoreHistory()

function getBestScore(gameSlug: string, gameMode: GameMode) {
  if (!currentRegion)
    return null

  const scores = getScoresForGame(currentRegion.slug, gameSlug, gameMode)

  if (!scores.length)
    return null

  return scores.reduce<number>((best, score) => {
    const accuracy = calculateAccuracy(score.totalCorrectQuestions, score.totalQuestions)

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
        <div>
          <p class="text-xl font-semibold mb-2">
            Select mode
          </p>
          <UTabs v-model="gameMode" :items="[{ label: 'Multiple Choice', icon: 'i-tabler-layout-grid-filled', value: 'multiple-choice' }, { label: 'Type Answer', icon: 'i-tabler-keyboard-filled', value: 'type-answer' }]" />
        </div>

        <div>
          <p class="text-xl font-semibold mb-2">
            Select game
          </p>
          <UPageGrid>
            <UPageCard
              v-for="game in currentRegion.games"
              :key="game.slug"
              :title="game.title"
              :to="`/play/${currentRegion.slug}/${game.slug}?mode=${gameMode}`"
              class="transition-transform hover:scale-105"
              orientation="horizontal"
              :ui="{ container: 'grid grid-cols-4 lg:grid-cols-4 items-center', wrapper: 'col-span-3' }"
            >
              <template #leading>
                <p class="text-sm text-primary font-semibold">
                  {{ game.countries.length.toString() }} Flags
                </p>
              </template>

              <ClientOnly>
                <span v-if="getBestScore(game.slug, gameMode) !== null" class="text-xl font-semibold text-muted text-right">
                  {{ getBestScore(game.slug, gameMode) }} %
                </span>
              </ClientOnly>
            </UPageCard>
          </UPageGrid>
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
