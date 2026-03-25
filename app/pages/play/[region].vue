<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const route = useRoute()
const region = String(route.params.region ?? '').toLowerCase()
if (!playableRegionSlugs.has(region)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Region not found',
  })
}

const regionTitle = computed(() => {
  if (region === 'world')
    return 'the World'

  if (region === 'americas')
    return 'the Americas'

  return region.charAt(0).toUpperCase() + region.slice(1)
})

type Scope = 'countries' | 'territories' | 'both'
const scopeOptions: Array<{ value: Scope, label: string }> = [
  { value: 'countries', label: 'Countries' },
  { value: 'territories', label: 'Territories' },
  { value: 'both', label: 'Both' },
]
const scopeQuery = useRouteQuery<Scope>('scope', 'countries')
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <UPageHeader
          :title="`Flags of ${regionTitle}`"
          :description="`Tune your challenge, press Start, and race through the flags of ${regionTitle}.`"
        >
          <template #headline>
            Let's guess
          </template>
        </UPageHeader>

        <fieldset class="mb-6">
          <legend class="mb-3 font-medium">
            Include in game
          </legend>

          <div class="flex flex-col gap-2">
            <label
              v-for="option in scopeOptions"
              :key="option.value"
              class="inline-flex items-center gap-2"
            >
              <input
                v-model="scopeQuery"
                type="radio"
                name="scope"
                :value="option.value"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>

        <p>{{ scopeQuery }}</p>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
