import type { Tabbar } from '#/global'
import type { RouteLocationNormalized } from 'vue-router'
import apiUser from '@/api/modules/user'
import storage from '@/utils/storage'
import { cloneDeep } from 'es-toolkit'
import useIframeStore from './iframe'
import useKeepAliveStore from './keepAlive'
import useRouteStore from './route'
import useSettingsStore from './settings'
import useUserStore from './user'

const useTabbarStore = defineStore(
  // 唯一ID
  'tabbar',
  () => {
    const settingsStore = useSettingsStore()
    const userStore = useUserStore()
    const routeStore = useRouteStore()
    const keepAliveStore = useKeepAliveStore()
    const iframeStore = useIframeStore()

    const list = ref<Tabbar.recordRaw[]>([])
    const leaveIndex = ref(-1)

    // 初始化常驻标签页
    function initPermanentTab() {
      const tabs: Tabbar.recordRaw[] = []
      routeStore.flatSystemRoutes.forEach((items) => {
        items.children?.forEach((route) => {
          if (route.meta?.permanent && route.meta?.breadcrumbNeste) {
            const fullPath = route.meta.breadcrumbNeste.at(-1)?.path as string
            const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (route.meta.activeMenu || fullPath) : fullPath
            tabs.push({
              tabId,
              fullPath,
              routeName: route.name,
              activeMenu: route.meta.activeMenu,
              title: typeof route.meta.title === 'function' ? route.meta.title() : route.meta.title,
              iframe: route.meta.iframe,
              icon: route.meta?.icon ?? route.meta?.breadcrumbNeste?.findLast(item => item.icon)?.icon,
              activeIcon: route.meta?.activeIcon ?? route.meta?.breadcrumbNeste?.findLast(item => item.activeIcon)?.activeIcon,
              name: route.name ? [route.name as string] : [],
              customTitleList: [],
              isPin: false,
              isPermanent: true,
            })
          }
        })
      })
      routeStore.flatRoutes.forEach((items) => {
        if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
          items.children?.forEach((route) => {
            if (route.meta?.permanent && route.meta?.breadcrumbNeste) {
              const fullPath = route.meta.breadcrumbNeste.at(-1)?.path as string
              const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (route.meta.activeMenu || fullPath) : fullPath
              tabs.push({
                tabId,
                fullPath,
                routeName: route.name,
                activeMenu: route.meta.activeMenu,
                title: typeof route.meta.title === 'function' ? route.meta.title() : route.meta.title,
                iframe: route.meta.iframe,
                icon: route.meta?.icon ?? route.meta?.breadcrumbNeste?.findLast(item => item.icon)?.icon,
                activeIcon: route.meta?.activeIcon ?? route.meta?.breadcrumbNeste?.findLast(item => item.activeIcon)?.activeIcon,
                name: route.name ? [route.name as string] : [],
                customTitleList: [],
                isPin: false,
                isPermanent: true,
              })
            }
          })
        }
        else {
          if (items.meta?.permanent) {
            const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (items.meta.activeMenu || items.path) : items.path
            tabs.push({
              tabId,
              fullPath: items.path,
              routeName: items.name,
              activeMenu: items.meta.activeMenu,
              title: typeof items.meta.title === 'function' ? items.meta.title() : items.meta.title,
              iframe: items.meta.iframe,
              icon: items.meta?.icon ?? items.meta?.breadcrumbNeste?.findLast(item => item.icon)?.icon,
              activeIcon: items.meta?.activeIcon ?? items.meta?.breadcrumbNeste?.findLast(item => item.activeIcon)?.activeIcon,
              name: items.name ? [items.name as string] : [],
              customTitleList: [],
              isPin: false,
              isPermanent: true,
            })
          }
        }
      })
      // 常驻的标签页添加到标签栏开头
      tabs.length && list.value.unshift(...tabs)
    }
    // 添加标签页
    async function add(route: RouteLocationNormalized) {
      const names: string[] = []
      route.matched.forEach((v, i) => {
        if (i > 0) {
          v.components?.default.name && names.push(v.components.default.name)
        }
      })
      const meta = route.matched.at(-1)?.meta
      const tabId = settingsStore.settings.tabbar.mergeTabsBy === 'activeMenu' ? (meta?.activeMenu ?? route.fullPath) : route.fullPath
      if (route.name !== 'reload') {
        // 记录查找到的标签页
        const findTab = list.value.find((item) => {
          if (settingsStore.settings.tabbar.mergeTabsBy === 'routeName' && item.routeName) {
            return item.routeName === route.name
          }
          else {
            return item.tabId === tabId
          }
        })
        // 新增标签页
        if (!findTab) {
          const listItem = {
            tabId,
            fullPath: route.fullPath,
            routeName: route.name,
            activeMenu: meta?.activeMenu,
            title: typeof meta?.title === 'function' ? meta.title() : meta?.title,
            iframe: meta?.iframe,
            icon: meta?.icon ?? meta?.breadcrumbNeste?.findLast(item => item.icon)?.icon,
            activeIcon: meta?.activeIcon ?? meta?.breadcrumbNeste?.findLast(item => item.activeIcon)?.activeIcon,
            name: names,
            customTitleList: [],
            isPin: false,
            isPermanent: false,
          }
          if (leaveIndex.value >= 0) {
            list.value.splice(leaveIndex.value + 1, 0, listItem)
            leaveIndex.value = -1
          }
          else {
            list.value.push(listItem)
          }
        }
        // 更新标签页
        else {
          if (settingsStore.settings.tabbar.mergeTabsBy !== '') {
            findTab.tabId = tabId
            findTab.fullPath = route.fullPath
            findTab.routeName = route.name
            findTab.activeMenu = meta?.activeMenu
            findTab.title = typeof meta?.title === 'function' ? meta.title() : meta?.title
            findTab.iframe = meta?.iframe
            findTab.icon = meta?.icon ?? meta?.breadcrumbNeste?.findLast(item => item.icon)?.icon
            findTab.activeIcon = meta?.activeIcon ?? meta?.breadcrumbNeste?.findLast(item => item.activeIcon)?.activeIcon
          }
        }
      }
      updateStorage()
    }
    // 删除指定标签页
    function remove(tabId: Tabbar.recordRaw['tabId']) {
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v) => {
        if (v.tabId === tabId) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      // 如果是手动点击关闭 tab 标签页，则删除页面缓存
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item) => {
        return item.tabId !== tabId
      })
      updateStorage()
    }
    // 删除两侧非常驻和非固定标签页
    function removeOtherSide(tabId: Tabbar.recordRaw['tabId']) {
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v) => {
        if (v.tabId !== tabId && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item) => {
        return item.tabId === tabId || item.isPermanent || item.isPin
      })
      updateStorage()
    }
    // 删除左侧非常驻和非固定标签页
    function removeLeftSide(tabId: Tabbar.recordRaw['tabId']) {
      // 查找指定路由对应在标签页列表里的下标
      const index = list.value.findIndex(item => item.tabId === tabId)
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v, i) => {
        if (i < index && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item, i) => {
        return i >= index || item.isPermanent || item.isPin
      })
      updateStorage()
    }
    // 删除右侧非常驻和非固定标签页
    function removeRightSide(tabId: Tabbar.recordRaw['tabId']) {
      // 查找指定路由对应在标签页列表里的下标
      const index = list.value.findIndex(item => item.tabId === tabId)
      const keepName: string[] = []
      const removeName: string[] = []
      const removeIframe: string[] = []
      list.value.forEach((v, i) => {
        if (i > index && !v.isPermanent && !v.isPin) {
          !v.iframe ? removeName.push(...v.name) : removeIframe.push(v.tabId)
        }
        else {
          keepName.push(...v.name)
        }
      })
      const name: string[] = []
      removeName.forEach((v) => {
        if (!keepName.includes(v)) {
          name.push(v)
        }
      })
      keepAliveStore.remove(name)
      iframeStore.close(removeIframe)
      list.value = list.value.filter((item, i) => {
        return i <= index || item.isPermanent || item.isPin
      })
      updateStorage()
    }
    // 固定标签页（移动到最后一个常驻或固定标签页后面，如果没有则移动至第一个）
    function pin(tabId: Tabbar.recordRaw['tabId']) {
      const index = list.value.findIndex(item => item.tabId === tabId)
      let toIndex = -1
      list.value.forEach((item, index) => {
        if (item.isPermanent || item.isPin) {
          toIndex = index
        }
      })
      if (index > toIndex) {
        list.value.splice(toIndex + 1, 0, list.value[index])
        list.value.splice(index + 1, 1)
      }
      // 修改状态
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          item.isPin = true
        }
      })
      updateStorage()
    }
    // 取消固定标签页（移动到最后一个常驻或固定标签页后面）
    function unPin(tabId: Tabbar.recordRaw['tabId']) {
      const index = list.value.findIndex(item => item.tabId === tabId)
      let toIndex = -1
      list.value.forEach((item, index) => {
        if (item.isPermanent || item.isPin) {
          toIndex = index
        }
      })
      list.value.splice(toIndex + 1, 0, list.value[index])
      list.value.splice(index, 1)
      // 修改状态
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          item.isPin = false
        }
      })
      updateStorage()
    }
    // 清空所有标签页，登出的时候需要清空
    function clean() {
      // 将非固定和非常驻标签页记录从 sessionStorage 中删除
      if (settingsStore.settings.tabbar.enableMemory) {
        const unpinData = storage.session.has('tabbarTempData') ? JSON.parse(storage.session.get('tabbarTempData') as string) : {}
        unpinData[userStore.account] = []
        storage.session.set('tabbarTempData', JSON.stringify(unpinData))
      }
      list.value = []
    }
    // 拖拽排序
    function sort(newIndex: number, oldIndex: number) {
      list.value.splice(newIndex, 0, list.value.splice(oldIndex, 1)[0])
      updateStorage()
    }
    // 设置标签页自定义标题
    function setCustomTitle({ tabId, title }: {
      tabId: Tabbar.recordRaw['tabId']
      title: string
    }) {
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          const findItem = item.customTitleList.find(v => v.fullPath === item.fullPath)
          if (findItem) {
            findItem.title = title
          }
          else {
            item.customTitleList.push({
              fullPath: item.fullPath,
              title,
            })
          }
        }
      })
      updateStorage()
    }
    // 重置标签页自定义标题
    function resetCustomTitle(tabId: Tabbar.recordRaw['tabId']) {
      list.value.forEach((item) => {
        if (item.tabId === tabId) {
          const index = item.customTitleList.findIndex(v => v.fullPath === item.fullPath)
          if (index > -1) {
            item.customTitleList.splice(index, 1)
          }
        }
      })
      updateStorage()
    }
    // 更新 storage 数据
    async function updateStorage() {
      if (settingsStore.settings.tabbar.storageTo === 'local') {
        const pinData = storage.local.has('tabbarPinData') ? JSON.parse(storage.local.get('tabbarPinData') as string) : {}
        pinData[userStore.account] = cloneDeep(list.value.filter((item) => {
          return item.isPin
        })).map((item) => {
          // 不存储自定义标题
          item.customTitleList = []
          return item
        })
        storage.local.set('tabbarPinData', JSON.stringify(pinData))
      }
      else if (settingsStore.settings.tabbar.storageTo === 'server') {
        await apiUser.tabbarEdit(JSON.stringify(cloneDeep(list.value.filter((item) => {
          return item.isPin
        })).map((item) => {
          // 不存储自定义标题
          item.customTitleList = []
          return item
        })))
      }
      if (settingsStore.settings.tabbar.enableMemory) {
        // 将非固定和非常驻标签页记录到 sessionStorage
        const unpinData = storage.session.has('tabbarTempData') ? JSON.parse(storage.session.get('tabbarTempData') as string) : {}
        unpinData[userStore.account] = cloneDeep(list.value.filter((item) => {
          return !item.isPin && !item.isPermanent
        })).map((item) => {
          // 不存储自定义标题
          item.customTitleList = []
          return item
        })
        storage.session.set('tabbarTempData', JSON.stringify(unpinData))
      }
    }
    // 根据 storage 数据复原当前帐号的标签页
    async function recoveryStorage() {
      if (settingsStore.settings.tabbar.storageTo === 'local') {
        if (storage.local.has('tabbarPinData')) {
          list.value.push(...(JSON.parse(storage.local.get('tabbarPinData') as string)[userStore.account] || []))
        }
      }
      else if (settingsStore.settings.tabbar.storageTo === 'server') {
        const res = await apiUser.tabbar()
        list.value.push(...(JSON.parse(res.data.tabbar || '[]')))
      }
      if (settingsStore.settings.tabbar.enableMemory && storage.session.has('tabbarTempData')) {
        list.value.push(...(JSON.parse(storage.session.get('tabbarTempData') as string)[userStore.account] || []))
      }
    }

    return {
      list,
      leaveIndex,
      initPermanentTab,
      add,
      remove,
      removeOtherSide,
      removeLeftSide,
      removeRightSide,
      pin,
      unPin,
      clean,
      sort,
      setCustomTitle,
      resetCustomTitle,
      recoveryStorage,
    }
  },
)

export default useTabbarStore
