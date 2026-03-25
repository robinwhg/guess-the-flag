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
