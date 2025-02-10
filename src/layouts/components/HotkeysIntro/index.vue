<i18n lang="yaml">
zh-cn:
  title: 快捷键介绍
  global:
    root: 全局
    system: 查看系统信息
    search: 唤起导航搜索
  nav:
    root: 主导航
    next: 激活下一个主导航
  tabbar:
    root: 标签栏
    prev: 切换到上一个标签页
    next: 切换到下一个标签页
    close: 关闭当前标签页
    n: 切换到第 n 个标签页
    last: 切换到最后一个标签页
  page:
    root: 页面
    maximizing: 最大化
    exit: 退出最大化
zh-tw:
  title: 熱鍵介紹
  global:
    root: 全域
    system: 查看系統資訊
    search: 叫起導航搜尋
  nav:
    root: 主導航
    next: 激活下一個主導航
  tabbar:
    root: 標籤欄
    prev: 切換到上一個標籤頁
    next: 切換到下一個標籤頁
    close: 關閉當前標籤頁
    n: 切換到第 n 個標籤頁
    last: 切換到最後一個標籤頁
  page:
    root: 頁面
    maximizing: 最大化
    exit: 退出最大化
en:
  title: Hotkeys Introduction
  global:
    root: Global
    system: View system information
    search: Activate navigation search
  nav:
    root: Main navigation
    next: Activate next main navigation
  tabbar:
    root: Tabbar
    prev: Switch to previous tab
    next: Switch to next tab
    close: Close current tab
    n: Switch to nth tab
    last: Switch to last tab
  page:
    root: Page
    maximizing: Maximize
    exit: Exit maximize
</i18n>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import eventBus from '@/utils/eventBus'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'HotkeysIntro',
})

const { t } = useI18n()

const isShow = ref(false)

const settingsStore = useSettingsStore()

onMounted(() => {
  eventBus.on('global-hotkeys-intro-toggle', () => {
    isShow.value = !isShow.value
  })
})
</script>

<template>
  <FaModal v-model="isShow" :title="t('title')" :footer="false">
    <div class="px-4">
      <div class="grid gap-4 sm-grid-cols-2">
        <div>
          <h2 class="m-0 text-lg font-bold">
            {{ t('global.root') }}
          </h2>
          <ul class="list-none ps-2 pt-2 text-sm">
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌘' : 'Ctrl' }}</FaKbd>
                <FaKbd>I</FaKbd>
              </div>
              {{ t('global.system') }}
            </li>
            <li v-if="settingsStore.settings.toolbar.navSearch && settingsStore.settings.navSearch.enableHotkeys" class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌘' : 'Ctrl' }}</FaKbd>
                <FaKbd>K</FaKbd>
              </div>
              {{ t('global.search') }}
            </li>
          </ul>
        </div>
        <div v-if="settingsStore.settings.menu.enableHotkeys && ['side', 'head'].includes(settingsStore.settings.menu.mode)">
          <h2 class="m-0 text-lg font-bold">
            {{ t('nav.root') }}
          </h2>
          <ul class="list-none ps-2 pt-2 text-sm">
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>`</FaKbd>
              </div>
              {{ t('nav.next') }}
            </li>
          </ul>
        </div>
        <div v-if="settingsStore.settings.tabbar.enable && settingsStore.settings.tabbar.enableHotkeys">
          <h2 class="m-0 text-lg font-bold">
            {{ t('tabbar.root') }}
          </h2>
          <ul class="list-none ps-2 pt-2 text-sm">
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>←</FaKbd>
              </div>
              {{ t('tabbar.prev') }}
            </li>
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>→</FaKbd>
              </div>
              {{ t('tabbar.next') }}
            </li>
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>W</FaKbd>
              </div>
              {{ t('tabbar.close') }}
            </li>
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>1~9</FaKbd>
              </div>
              {{ t('tabbar.n') }}
            </li>
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>0</FaKbd>
              </div>
              {{ t('tabbar.last') }}
            </li>
          </ul>
        </div>
        <div v-if="settingsStore.settings.mainPage.enableHotkeys">
          <h2 class="m-0 text-lg font-bold">
            {{ t('page.root') }}
          </h2>
          <ul class="list-none ps-2 pt-2 text-sm">
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>↑</FaKbd>
              </div>
              {{ t('page.maximizing') }}
            </li>
            <li class="flex-baseline gap-2 py-1">
              <div class="flex-shrink-0 space-x-1">
                <FaKbd>{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }}</FaKbd>
                <FaKbd>↓</FaKbd>
              </div>
              {{ t('page.exit') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </FaModal>
</template>
