<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import dayjs from '@/utils/dayjs'
import { ua } from '@/utils/ua'
import { useI18n } from 'vue-i18n'
import Provider from './ui/provider/index.vue'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'

const route = useRoute()

const settingsStore = useSettingsStore()

const { locale } = useI18n()
const { auth } = useAuth()
const { generateI18nTitle } = useMenu()

document.body.setAttribute('data-os', ua.getOS().name || '')

const isAuth = computed(() => {
  return route.matched.every((item) => {
    return auth(item.meta.auth ?? '')
  })
})

// 设置网页 title
watch([
  () => settingsStore.settings.app.enableDynamicTitle,
  () => settingsStore.title,
  () => settingsStore.customTitleList,
  () => settingsStore.lang,
], () => {
  nextTick(() => {
    if (settingsStore.settings.app.enableDynamicTitle && settingsStore.title) {
      const title = settingsStore.customTitleList.find(item => item.fullPath === route.fullPath)?.title || generateI18nTitle(settingsStore.title)
      document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
    }
    else {
      document.title = import.meta.env.VITE_APP_TITLE
    }
  })
}, {
  immediate: true,
  deep: true,
})

onMounted(() => {
  settingsStore.setMode(document.documentElement.clientWidth)
  window.addEventListener('resize', () => {
    settingsStore.setMode(document.documentElement.clientWidth)
  })
})

watch(() => settingsStore.lang, () => {
  locale.value = settingsStore.lang
})

watch(() => settingsStore.lang, () => {
  switch (settingsStore.lang) {
    case 'zh-cn':
      dayjs.locale('zh-cn')
      break
    case 'zh-tw':
      dayjs.locale('zh-tw')
      break
    case 'en':
      dayjs.locale('en')
      break
  }
}, {
  immediate: true,
})
</script>

<template>
  <Provider>
    <RouterView v-slot="{ Component }">
      <component :is="Component" v-if="isAuth" />
      <FaNotAllowed v-else />
    </RouterView>
    <FaToast />
    <FaNotification />
    <FaSystemInfo />
  </Provider>
</template>
