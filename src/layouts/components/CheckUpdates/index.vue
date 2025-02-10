<i18n lang="yaml">
zh-cn:
  message: 有新版本可用
  description: 点击刷新按钮获取最新版本
  confirm: 刷新
  cancel: 稍后
zh-tw:
  message: 有新版本可用
  description: 點擊刷新按鈕取得最新版本
  confirm: 刷新
  cancel: 稍後
en:
  message: The new version is available
  description: Click the refresh button to get the latest version
  confirm: Refresh
  cancel: Later
</i18n>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import { useFaModal } from '@/ui/components/FaModal'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'CheckUpdates',
})

const { t } = useI18n()
const settingsStore = useSettingsStore()

const visible = ref(false)
const lastVersionTag = ref('')
const checkUpdatesInterval = ref(Number.NaN)

async function getVersionTag() {
  try {
    const response = await fetch(`${location.origin}${location.pathname}`, {
      cache: 'no-cache',
      method: 'HEAD',
    })
    return response.headers.get('etag') || response.headers.get('last-modified')
  }
  catch {
    console.error('检查更新失败')
  }
}

async function checkUpdates() {
  const versionTag = await getVersionTag()
  if (!versionTag) {
    return
  }
  if (!lastVersionTag.value) {
    lastVersionTag.value = versionTag
    return
  }
  if (visible.value) {
    return
  }
  if (lastVersionTag.value !== versionTag && versionTag) {
    stopInterval()
    visible.value = true
    useFaModal().confirm({
      title: t('message'),
      content: t('description'),
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      onConfirm: () => location.reload(),
    })
  }
}

function startInterval() {
  checkUpdates()
  checkUpdatesInterval.value = window.setInterval(checkUpdates, 60_000)
}

function stopInterval() {
  clearInterval(checkUpdatesInterval.value)
}

function handleVisibilitychange() {
  if (document.hidden) {
    stop()
  }
  else {
    checkUpdates().finally(() => {
      startInterval()
    })
  }
}

onMounted(() => {
  if (import.meta.env.PROD && settingsStore.settings.app.enableCheckUpdates) {
    startInterval()
    document.addEventListener('visibilitychange', handleVisibilitychange)
  }
})

onUnmounted(() => {
  if (import.meta.env.PROD && settingsStore.settings.app.enableCheckUpdates) {
    stopInterval()
    document.removeEventListener('visibilitychange', handleVisibilitychange)
  }
})
</script>

<template>
  <div />
</template>
