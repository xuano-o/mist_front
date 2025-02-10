import useSettingsStore from '@/store/modules/settings'
import useTabbarStore from '@/store/modules/tabbar'

export default function useMainPage() {
  const route = useRoute()
  const router = useRouter()

  const settingsStore = useSettingsStore()
  const tabbarStore = useTabbarStore()

  const tabbar = useTabbar()

  function reload() {
    router.push({
      name: 'reload',
    })
  }

  function setCustomTitle(title: string) {
    settingsStore.setCustomTitle(route.fullPath, title)
    if (settingsStore.settings.tabbar.enable) {
      tabbarStore.setCustomTitle({
        tabId: tabbar.getId(),
        title,
      })
    }
  }

  function resetCustomTitle() {
    settingsStore.resetCustomTitle(route.fullPath)
    if (settingsStore.settings.tabbar.enable) {
      tabbarStore.resetCustomTitle(tabbar.getId())
    }
  }

  function maximize(status: boolean) {
    settingsStore.setMainPageMaximize(status)
  }

  return {
    reload,
    setCustomTitle,
    resetCustomTitle,
    maximize,
  }
}
