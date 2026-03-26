<script setup lang="ts">
const baseTitle = 'Guess the Flag'
const description = 'Pick a region and test how many flags you can identify correctly in a single run.'

const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#101828' : 'white')

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
  meta: [
    { name: 'application-name', content: baseTitle },
    { name: 'apple-mobile-web-app-title', content: baseTitle },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${baseTitle}` : baseTitle,
  description,
  ogSiteName: baseTitle,
  ogDescription: description,
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
