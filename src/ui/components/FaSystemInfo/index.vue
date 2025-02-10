<i18n lang="json">
{
  "zh-cn": {
    "title": "系统信息",
    "version": "版本号",
    "lastBuildTime": "最后编译时间",
    "deps": "生产环境依赖",
    "devDeps": "开发环境依赖"
  },
  "zh-tw": {
    "title": "系統信息",
    "version": "版本號",
    "lastBuildTime": "最後編譯時間",
    "deps": "生產環境依賴",
    "devDeps": "開發環境依賴"
  },
  "en": {
    "title": "System Info",
    "version": "Version",
    "lastBuildTime": "Last Build Time",
    "deps": "Production Dependencies",
    "devDeps": "Development Dependencies"
  }
}
</i18n>

<script setup lang="ts">
import hotkeys from 'hotkeys-js'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FaSystemInfo',
})

const { t } = useI18n()

const isShow = ref(false)

const { pkg, lastBuildTime } = __SYSTEM_INFO__

onMounted(() => {
  hotkeys('command+i, ctrl+i', () => {
    isShow.value = true
  })
})
</script>

<template>
  <FaDrawer v-model="isShow" :title="t('title')" :footer="false">
    <div v-if="pkg.version">
      <FaDivider>
        {{ t('version') }}
      </FaDivider>
      <div class="text-center text-lg font-bold font-sans">
        {{ pkg.version }}
      </div>
    </div>
    <div>
      <FaDivider>
        {{ t('lastBuildTime') }}
      </FaDivider>
      <div class="text-center text-lg font-bold font-sans">
        {{ lastBuildTime }}
      </div>
    </div>
    <div>
      <FaDivider>
        {{ t('deps') }}
      </FaDivider>
      <ul class="list-none text-sm">
        <li v-for="(val, key) in (pkg.dependencies as object)" :key="key" class="flex items-center justify-between rounded-lg px-2 py-1.5 hover-bg-secondary">
          <div class="font-bold">
            {{ key }}
          </div>
          <div class="font-sans">
            {{ val }}
          </div>
        </li>
      </ul>
    </div>
    <div>
      <FaDivider>
        {{ t('devDeps') }}
      </FaDivider>
      <ul class="list-none text-sm">
        <li v-for="(val, key) in (pkg.devDependencies as object)" :key="key" class="flex items-center justify-between rounded-lg px-2 py-1.5 hover-bg-secondary">
          <div class="font-bold">
            {{ key }}
          </div>
          <div class="font-sans">
            {{ val }}
          </div>
        </li>
      </ul>
    </div>
  </FaDrawer>
</template>
