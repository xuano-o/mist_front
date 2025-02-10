import type { App } from 'vue'
import useSettingsStore from '@/store/modules/settings'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { cloneDeep } from 'es-toolkit'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  flatJson: true,
  fallbackLocale: 'zh-cn',
  messages,
  missingWarn: false,
  fallbackWarn: false,
})

function install(app: App) {
  const settingsStore = useSettingsStore()
  i18n.global.locale.value = settingsStore.lang
  app.use(i18n)
}

function getLocales() {
  return cloneDeep(messages)
}

const localesName: Record<string, any> = {}
for (const key in messages) {
  switch (key) {
    case 'zh-cn':
      localesName[key] = '中文(简体)'
      break
    case 'zh-tw':
      localesName[key] = '中文(繁體)'
      break
    case 'en':
      localesName[key] = 'English'
      break
  }
}

// 用于路由 meta 配置，方便在 VSCode I18n Ally 插件进行显示，无实际作用
function $t(key: string) {
  return key
}

export default { install }

export {
  $t,
  getLocales,
  i18n,
  localesName,
}
