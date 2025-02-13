import type { RecursiveRequired, Settings } from '#/global'
import settingsDefault from '@/settings.default'
import { merge } from '@/utils/object'
import { cloneDeep } from 'es-toolkit'

const globalSettings: Settings.all = {
  app: {
    lightTheme: 'blue',
    darkTheme: 'blue',
    enableDynamicTitle: true,
  },
  menu: {
    mode: 'single',
  },
  tabbar: {
    style: 'card',
  },
  toolbar: {
    favorites: true,
    navSearch: false,
    notification: true,
    i18n: true,
    layout: [
      'favorites',
      'breadcrumb',
      '->',
      'navSearch',
      'i18n',
      'notification',
      'fullscreen',
      'pageReload',
      'colorScheme',
    ],
  },
  breadcrumb: {
    style: 'modern',
  },
  copyright: {
    enable: true,
    dates: '2024-2025',
    company: '软件开发与应用创新工作室',
  },
}

export default merge(globalSettings, cloneDeep(settingsDefault)) as RecursiveRequired<Settings.all>
