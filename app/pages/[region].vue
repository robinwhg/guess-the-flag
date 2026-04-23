<script setup lang="ts">
const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()

const currentRegion = getPlayableRegionBySlug(region)

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

const bestScoreByGameSlug = computed<Record<string, number | null>>(() => {
  const entries = currentRegion.games.map((game) => {
    const scores = getScoresForGame(currentRegion.slug, game.slug, gameMode.value)

    if (!scores.length)
      return [game.slug, null] as const

    const bestScore = scores.reduce<number>((best, score) => {
      const accuracy = calculateAccuracy(score.totalCorrectQuestions, score.totalQuestions)

      return Math.max(best, accuracy)
    }, 0)

    return [game.slug, bestScore] as const
  })

  return Object.fromEntries(entries)
})
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
        <UFormField size="xl" label="Select mode" description="Scores get saved separately.">
          <UTabs v-model="gameMode" :items="[{ label: 'Multiple Choice', icon: 'i-tabler-layout-grid', value: 'multiple-choice' }, { label: 'Type Answer', icon: 'i-tabler-keyboard', value: 'type-answer' }]" />
        </UFormField>

        <UFormField size="xl" label="Select difficulty" description="Practice shows an info card after every flag.">
          <UTabs v-model="gameDifficulty" :items="[{ label: 'Practice', icon: 'i-tabler-school', value: 'practice' }, { label: 'Test', icon: 'i-tabler-target-arrow', value: 'test' }]" />
        </UFormField>

        <UFormField size="xl" label="Select game">
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
                  <span v-if="bestScoreByGameSlug[game.slug] !== null" class="text-xl font-semibold text-muted text-right">
                    {{ bestScoreByGameSlug[game.slug] }} %
                  </span>
                </Transition>
              </ClientOnly>
            </UPageCard>
          </UPageGrid>
        </UFormField>
      </div>
    </UPageBody>
  </UPage>
</template>
