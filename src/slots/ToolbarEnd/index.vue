<i18n lang="yaml">
zh-cn:
  profile: 个人设置
  preferences: 偏好设置
  hotkeys: 快捷键介绍
  logout: 退出登录
  current_account: 当前登录账号
zh-tw:
  profile: 個人設置
  preferences: 偏好設置
  hotkeys: 快捷鍵介紹
  logout: 退出登錄
  current_account: 當前登錄帳號
en:
  profile: Personal Settings
  preferences: Preferences
  hotkeys: Hotkeys Introduction
  logout: Logout
  current_account: Current Login Account
</i18n>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import eventBus from '@/utils/eventBus'
import { useI18n } from 'vue-i18n'
import Profile from './profile.vue'

const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const { t } = useI18n()
const { generateI18nTitle } = useMenu()

const isProfileShow = ref(false)
</script>

<template>
  <FaDropdown
    align="end" :items="[
      [
        { label: generateI18nTitle(settingsStore.settings.home.title), icon: 'i-mdi:home', handle: () => router.push({ path: settingsStore.settings.home.fullPath }), hide: !settingsStore.settings.home.enable },
        { label: t('profile'), icon: 'i-mdi:account', handle: () => isProfileShow = true },
        { label: t('preferences'), icon: 'i-mdi:cog', handle: () => eventBus.emit('global-preferences-toggle'), hide: !settingsStore.settings.userPreferences.enable },
      ],
      [
        { label: t('hotkeys'), icon: 'i-mdi:keyboard', handle: () => eventBus.emit('global-hotkeys-intro-toggle'), hide: settingsStore.mode !== 'pc' },
      ],
      [
        { label: t('logout'), icon: 'i-mdi:logout', handle: () => userStore.logout(settingsStore.settings.home.fullPath) },
      ],
    ]" class="flex-center"
  >
    <template #label>
      <div class="space-y-2">
        <div class="text-xs text-secondary-foreground/50 font-light">
          {{ t('current_account') }}
        </div>
        <div class="flex-center-start gap-2">
          <FaAvatar :src="userStore.avatar" :fallback="userStore.account.slice(0, 5)" shape="square" />
          <div class="space-y-1">
            <div class="text-base lh-none">
              {{ userStore.account }}
            </div>
            <div class="text-xs text-secondary-foreground/50 font-normal">
              这里可以显示邮箱
            </div>
          </div>
        </div>
      </div>
    </template>
    <FaButton variant="ghost" class="h-9 flex-center gap-1 px-2">
      <FaAvatar :src="userStore.avatar" class="size-6">
        <FaIcon name="i-carbon:user-avatar-filled-alt" class="size-6 text-secondary-foreground/50" />
      </FaAvatar>
      <template v-if="settingsStore.mode === 'pc'">
        {{ userStore.account }}
        <FaIcon name="i-ep:caret-bottom" />
      </template>
    </FaButton>
  </FaDropdown>
  <FaModal v-model="isProfileShow" align-center :header="false" :footer="false" :close-on-click-overlay="false" :close-on-press-escape="false" class="h-500px min-w-600px overflow-hidden" content-class="min-h-full p-0 flex">
    <Profile />
  </FaModal>
</template>
