<script setup lang="ts">
const playableRegions = [
  {
    slug: 'world',
    title: 'World',
    description: 'Play with all available countries in one run.',
    img: '/img/world.svg',
  },
  {
    slug: 'africa',
    title: 'Africa',
    description: 'Focus on African countries and territories.',
    img: '/img/africa.svg',
  },
  {
    slug: 'americas',
    title: 'Americas',
    description: 'North, Central, South America, and the Caribbean.',
    img: '/img/americas.svg',
  },
  {
    slug: 'asia',
    title: 'Asia',
    description: 'Play countries across Western to Eastern Asia.',
    img: '/img/asia.svg',
  },
  {
    slug: 'europe',
    title: 'Europe',
    description: 'Challenge yourself with European flags.',
    img: '/img/europe.svg',
  },
  {
    slug: 'oceania',
    title: 'Oceania',
    description: 'Includes Australia, Polynesia, Micronesia, and Melanesia.',
    img: '/img/oceania.svg',
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
              class="transition-transform hover:scale-105"
            >
              <img v-if="r.img" :src="r.img" class="object-contain object-center max-h-32 w-full">
            </UPageCard>
          </UPageGrid>
        </template>
      </UPageHero>
    </UPageBody>
  </UPage>
</template>
