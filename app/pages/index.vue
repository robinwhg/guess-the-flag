<template>
  <UPage>
    <UPageBody>
      <UPageHero
        headline="Globe Rush"
        title="Play the Ultimate Flag Quiz"
        description="Pick a region and test how many flags you can identify correctly in a single run."
        :ui="{ footer: 'text-start' }"
      >
        <template #footer>
          <Transition name="slide-up" mode="out-in" appear>
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
                    class="h-full w-full object-contain object-center"
                  >
                </div>
              </UPageCard>
            </UPageGrid>
          </Transition>
        </template>
      </UPageHero>
    </UPageBody>
  </UPage>
</template>
