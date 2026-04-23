<script setup lang="ts">
import { breakpointsTailwind, createReusableTemplate, useBreakpoints } from '@vueuse/core'

interface PlayHeaderStatOverlayProps {
  icon: string
  value: string
  label: string
  title: string
  description: string
  items: Country[]
  descriptionResolver: (country: Country) => string
}

const props = defineProps<PlayHeaderStatOverlayProps>()
const { icon, value, label, title, description, items, descriptionResolver } = toRefs(props)

const breakpoints = useBreakpoints (breakpointsTailwind)
const isDesktop = breakpoints.greater('sm')
const open = ref(false)
const searchQuery = ref('')

const normalizedQuery = computed(() => {
  return searchQuery.value.trim().toLowerCase()
})

const filteredItems = computed(() => {
  if (!normalizedQuery.value) {
    return items.value
  }

  return items.value.filter((item) => {
    const title = item.name.common.toLowerCase()
    const description = descriptionResolver.value(item).toLowerCase()

    return title.includes(normalizedQuery.value) || description.includes(normalizedQuery.value)
  })
})

watch(open, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
  }
})

const [DefineBodyTemplate, ReuseBodyTemplate] = createReusableTemplate()
</script>

<template>
  <div>
    <UPageCard
      :icon="icon"
      :title="value"
      :description="label"
      class="cursor-pointer transition-transform hover:scale-105"
      role="button"
      tabindex="0"
      :aria-label="`Open ${label.toLowerCase()} details`"
      @click="open = true"
      @keydown.enter="open = true"
      @keydown.space.prevent="open = true"
    />

    <ClientOnly>
      <DefineBodyTemplate>
        <div class="flex h-full flex-col gap-2">
          <UInput
            v-if="items.length > 10"
            v-model="searchQuery"
            variant="soft"
            icon="i-tabler-search"
            :placeholder="`Search ${label.toLowerCase()}...`"
          >
            <template v-if="searchQuery?.length" #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-tabler-circle-x"
                aria-label="Clear input"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>

          <UPageList
            v-if="filteredItems.length"
            class="flex-1 space-y-2"
          >
            <UPageCard
              v-for="item in filteredItems"
              :key="item.cca3"
              :title="item.name.common"
              :description="descriptionResolver(item)"
              orientation="horizontal"
              reverse
              :ui="{ container: 'grid grid-cols-3 lg:grid-cols-3 items-center', wrapper: 'col-span-2' }"
            >
              <img
                :src="item.flag.svg"
                :alt="item.flag.alt || `Flag of ${item.name.common}`"
                loading="lazy"
                decoding="async"
                class="h-16 w-full object-contain object-center"
              >
            </UPageCard>
          </UPageList>

          <div
            v-else
            class="flex flex-1 items-center justify-center rounded-md border border-dashed border-default px-4 text-sm text-muted"
          >
            No matches found.
          </div>
        </div>
      </DefineBodyTemplate>

      <UModal
        v-if="isDesktop"
        v-model:open="open"
        :title="title"
        :description="description"
      >
        <template #body>
          <ReuseBodyTemplate />
        </template>
      </UModal>

      <UDrawer
        v-else
        v-model:open="open"
        :title="title"
        :description="description"
        direction="bottom"
      >
        <template #body>
          <ReuseBodyTemplate />
        </template>
      </UDrawer>
    </ClientOnly>
  </div>
</template>
