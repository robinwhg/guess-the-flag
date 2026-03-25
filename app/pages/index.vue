<script setup lang="ts">
const playableRegions = [
  {
    slug: 'world',
    title: 'World',
    description: 'Play with all available countries in one run.',
  },
  {
    slug: 'africa',
    title: 'Africa',
    description: 'Focus on African countries and territories.',
  },
  {
    slug: 'americas',
    title: 'Americas',
    description: 'North, Central, South America, and the Caribbean.',
  },
  {
    slug: 'asia',
    title: 'Asia',
    description: 'Play countries across Western to Eastern Asia.',
  },
  {
    slug: 'europe',
    title: 'Europe',
    description: 'Challenge yourself with European flags.',
  },
  {
    slug: 'oceania',
    title: 'Oceania',
    description: 'Includes Australia, Polynesia, Micronesia, and Melanesia.',
  },
]
</script>

<template>
  <UPage>
    <UPageBody>
      <UPageHero
        headline="Guess the Flag"
        title="Play the Ultimate Flag Quiz"
        description="Pick a region and test how many flags you can identify correctly in a single run."
        :ui="{ footer: 'text-start' }"
      >
        <template #footer>
          <UPageGrid>
            <UPageCard
              v-for="r in playableRegions" :key="r.slug"
              :title="r.title"
              :description="r.description"
              :to="`/play/${r.slug}`"
              variant="subtle"
            />
          </UPageGrid>
        </template>
      </UPageHero>
    </UPageBody>
  </UPage>
</template>
