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

const gameMode = useCookie<GameMode>('globe-rush:mode:v1', {
  default: () => 'multiple-choice',
  sameSite: 'lax',
})
const gameDifficulty = useCookie<GameDifficulty>('globe-rush:difficulty:v1', {
  default: () => 'test',
  sameSite: 'lax',
})

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
          <UTabs v-model="gameMode" :items="[{ label: 'Multiple Choice', icon: 'i-tabler-layout-grid', value: 'multiple-choice' }, { label: 'Type Answer', icon: 'i-tabler-keyboard', value: 'type-answer' }]" />
        </div>

        <div>
          <p class="text-xl font-semibold mb-2">
            Select difficulty
          </p>
          <UTabs v-model="gameDifficulty" :items="[{ label: 'Practice', icon: 'i-tabler-school', value: 'practice' }, { label: 'Test', icon: 'i-tabler-target-arrow', value: 'test' }]" />
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
              :to="`/play/${currentRegion.slug}/${game.slug}?mode=${gameMode}&difficulty=${gameDifficulty}`"
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
                <Transition name="fade" mode="out-in">
                  <span v-if="getBestScore(game.slug, gameMode) !== null" class="text-xl font-semibold text-muted text-right">
                    {{ getBestScore(game.slug, gameMode) }} %
                  </span>
                </Transition>
              </ClientOnly>
            </UPageCard>
          </UPageGrid>
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
