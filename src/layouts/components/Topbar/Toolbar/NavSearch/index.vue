<i18n lang="yaml">
zh-cn:
  text: 搜索
zh-tw:
  text: 搜索
en:
  text: Search
</i18n>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import { useI18n } from 'vue-i18n'
import Search from './search.vue'

defineOptions({
  name: 'NavSearch',
})

const settingsStore = useSettingsStore()

const { t } = useI18n()

const isShow = ref(false)
</script>

<template>
  <FaButton :variant="settingsStore.mode === 'pc' ? 'outline' : 'ghost'" :size="settingsStore.mode === 'pc' ? undefined : 'icon'" :class="{ 'mx-2 px-3': settingsStore.mode === 'pc' }" @click="isShow = true">
    <FaIcon name="i-ri:search-line" class="size-4" />
    <template v-if="settingsStore.mode === 'pc'">
      <span class="text-sm text-muted-foreground/60 transition group-hover-text-muted-foreground">{{ t('text') }}</span>
      <FaKbd v-if="settingsStore.settings.navSearch.enableHotkeys" class="-me-1">
        {{ settingsStore.os === 'mac' ? '⌘' : 'Ctrl' }} K
      </FaKbd>
    </template>
  </FaButton>
  <Search v-model="isShow" />
</template>
