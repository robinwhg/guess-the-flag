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
              :to="`/${r.slug}`"
              class="transition-transform hover:scale-105"
            >
              <div class="h-32 flex items-center">
                <img
                  v-if="r.img"
                  :src="r.img"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-contain object-center"
                >
              </div>
            </UPageCard>
          </UPageGrid>
        </template>
      </UPageHero>
    </UPageBody>
  </UPage>
</template>
