<script setup lang="ts">
import { useSlots } from '@/slots'
import useSettingsStore from '@/store/modules/settings'
import Tools from './tools.vue'

defineOptions({
  name: 'ToolbarLeftSide',
})

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="flex items-center">
    <FaButton v-if="settingsStore.mode === 'mobile'" variant="ghost" size="icon" class="h-9 w-9 -rotate-z-180" @click="settingsStore.toggleSidebarCollapse()">
      <FaIcon name="toolbar-collapse" class="size-4" :class="{ 'rotate-180': settingsStore.settings.app.direction === 'rtl' }" />
    </FaButton>
    <component :is="useSlots('toolbar-start')" />
    <Tools mode="left-side" />
  </div>
</template>
