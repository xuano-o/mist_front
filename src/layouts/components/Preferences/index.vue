<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import eventBus from '@/utils/eventBus'
import Sortable from 'sortablejs'
import themes from '../../../../themes'

defineOptions({
  name: 'Preferences',
})

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const isShow = ref(false)

const themeList = computed(() => {
  return Object.keys(themes).map((key) => {
    return {
      label: key as keyof typeof themes,
      value: (themes as any)[key][settingsStore.currentColorScheme!],
    }
  })
})

const toolbarLayoutRef = useTemplateRef('toolbarLayoutRef')
watch(() => toolbarLayoutRef.value, (val) => {
  if (val) {
    // eslint-disable-next-line no-new
    new Sortable(val, {
      animation: 200,
      ghostClass: 'op-30',
      draggable: '.draggable',
      filter: '.no-drag',
      onUpdate: (e) => {
        if (e.newIndex !== undefined && e.oldIndex !== undefined) {
          userStore.preferences.toolbar && userStore.preferences.toolbar.layout && userStore.preferences.toolbar.layout.splice(e.newIndex, 0, userStore.preferences.toolbar.layout.splice(e.oldIndex, 1)[0])
        }
      },
    })
  }
})

onMounted(() => {
  eventBus.on('global-preferences-toggle', () => {
    isShow.value = !isShow.value
  })
})

async function handleReset() {
  userStore.updatePreferences()
  location.reload()
}
</script>

<template>
  <FaDrawer v-model="isShow" title="偏好设置" :side="settingsStore.settings.app.direction === 'ltr' ? 'right' : 'left'">
    <div
      v-if="
        userStore.preferences.app?.hasOwnProperty('colorScheme')
          || (userStore.preferences.app?.hasOwnProperty('lightTheme') && userStore.preferences.app?.hasOwnProperty('darkTheme'))
      "
    >
      <div class="divider">
        颜色主题风格
      </div>
      <div v-if="userStore.preferences.app?.hasOwnProperty('colorScheme')" class="flex items-center justify-center pb-4">
        <FaTabs
          v-model="userStore.preferences.app.colorScheme"
          :list="[
            { icon: 'i-ri:sun-line', label: '明亮', value: 'light' },
            { icon: 'i-ri:moon-line', label: '暗黑', value: 'dark' },
            { icon: 'i-codicon:color-mode', label: '系统', value: '' },
          ]"
          class="w-60"
        />
      </div>
      <div v-if="userStore.preferences.app?.hasOwnProperty('lightTheme') && userStore.preferences.app?.hasOwnProperty('darkTheme')" class="themes">
        <div v-for="item in themeList" :key="item.label" class="theme" :class="{ active: settingsStore.currentColorScheme === 'dark' ? userStore.preferences.app.darkTheme === item.label : userStore.preferences.app.lightTheme === item.label }" @click="settingsStore.currentColorScheme === 'dark' ? userStore.preferences.app?.hasOwnProperty('darkTheme') && (userStore.preferences.app.darkTheme = item.label) : userStore.preferences.app?.hasOwnProperty('lightTheme') && (userStore.preferences.app.lightTheme = item.label)">
          <div class="content" :style="`background-color: hsl(${item.value['--primary']});`" />
        </div>
      </div>
      <div v-if="userStore.preferences.app?.hasOwnProperty('themeSync')" class="setting-item">
        <div class="label">
          主题同步
          <FaTooltip text="切换颜色方案将共用一套主题">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.app.themeSync" />
      </div>
      <div v-if="userStore.preferences.app?.hasOwnProperty('radius')" class="setting-item">
        <div class="label">
          圆角系数
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { label: 0, value: 0 },
              { label: 0.25, value: 0.25 },
              { label: 0.5, value: 0.5 },
              { label: 0.75, value: 0.75 },
              { label: 1, value: 1 },
            ]" :key="index" :variant="userStore.preferences.app.radius === item.value ? 'default' : 'outline'" size="sm" class="w-12" @click="userStore.preferences.app.radius = (item.value as any)"
          >
            {{ item.label }}
          </FaButton>
        </div>
      </div>
    </div>
    <div v-if="settingsStore.mode === 'pc' && userStore.preferences.menu?.hasOwnProperty('mode')">
      <div class="divider">
        导航栏模式
      </div>
      <div class="menu-mode">
        <FaTooltip text="侧边栏模式 (含主导航)" :delay="500">
          <div class="mode mode-side" :class="{ active: userStore.preferences.menu.mode === 'side' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'side')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
        <FaTooltip text="顶部模式" :delay="500">
          <div class="mode mode-head" :class="{ active: userStore.preferences.menu.mode === 'head' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'head')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
        <FaTooltip text="侧边栏模式 (不含主导航)" :delay="500">
          <div class="mode mode-single" :class="{ active: userStore.preferences.menu.mode === 'single' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'single')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
      </div>
      <div class="menu-mode">
        <FaTooltip text="侧边栏精简模式" :delay="500">
          <div class="mode mode-only-side" :class="{ active: userStore.preferences.menu.mode === 'only-side' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'only-side')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
        <FaTooltip text="顶部精简模式" :delay="500">
          <div class="mode mode-only-head" :class="{ active: userStore.preferences.menu.mode === 'only-head' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'only-head')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
        <FaTooltip text="侧边栏面板模式" :delay="500">
          <div class="mode mode-side-panel" :class="{ active: settingsStore.settings.menu.mode === 'side-panel' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'side-panel')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
        <FaTooltip text="顶部面板模式" :delay="500">
          <div class="mode mode-head-panel" :class="{ active: settingsStore.settings.menu.mode === 'head-panel' }" @click="userStore.preferences.menu?.hasOwnProperty('mode') && (userStore.preferences.menu.mode = 'head-panel')">
            <div class="mode-container" />
          </div>
        </FaTooltip>
      </div>
    </div>
    <div v-if="settingsStore.mode === 'pc' && userStore.preferences.layout?.hasOwnProperty('widthMode')">
      <div class="divider">
        页宽模式
      </div>
      <div class="app-width-mode">
        <FaTooltip text="自适应" :delay="500">
          <div class="mode mode-adaption" :class="{ active: userStore.preferences.layout.widthMode === 'adaption' }" @click="userStore.preferences.layout?.hasOwnProperty('widthMode') && (userStore.preferences.layout.widthMode = 'adaption')">
            <FaIcon name="i-ep:back" class="left" />
            <FaIcon name="i-ep:right" class="right" />
          </div>
        </FaTooltip>
        <FaTooltip text="自适应 (有最小宽度)" :delay="500">
          <div class="mode mode-adaption-min-width" :class="{ active: userStore.preferences.layout.widthMode === 'adaption-min-width' }" @click="userStore.preferences.layout?.hasOwnProperty('widthMode') && (userStore.preferences.layout.widthMode = 'adaption-min-width')">
            <FaIcon name="i-ep:back" class="left" />
            <FaIcon name="i-ep:right" class="right" />
          </div>
        </FaTooltip>
        <FaTooltip text="定宽居中" :delay="500">
          <div class="mode mode-center" :class="{ active: userStore.preferences.layout.widthMode === 'center' }" @click="userStore.preferences.layout?.widthMode && (userStore.preferences.layout.widthMode = 'center')" />
        </FaTooltip>
        <FaTooltip text="定宽居中 (有最大宽度)" :delay="500">
          <div class="mode mode-center-max-width" :class="{ active: userStore.preferences.layout.widthMode === 'center-max-width' }" @click="userStore.preferences.layout?.widthMode && (userStore.preferences.layout.widthMode = 'center-max-width')">
            <FaIcon name="i-ep:back" class="left" />
            <FaIcon name="i-ep:right" class="right" />
          </div>
        </FaTooltip>
      </div>
    </div>
    <div v-if="userStore.preferences.mainPage?.hasOwnProperty('enableTransition') || userStore.preferences.mainPage?.hasOwnProperty('transitionMode')">
      <div class="divider">
        页面切换动画
      </div>
      <div v-if="userStore.preferences.mainPage?.hasOwnProperty('enableTransition')" class="flex items-center justify-center pb-4">
        <FaSwitch v-model="userStore.preferences.mainPage.enableTransition" />
      </div>
      <div v-if="userStore.preferences.mainPage?.hasOwnProperty('transitionMode')" class="transition-mode">
        <FaTooltip text="淡入淡出" :delay="500">
          <div class="mode mode-fade" :class="{ active: userStore.preferences.mainPage.transitionMode === 'fade' }" @click="userStore.preferences.mainPage?.hasOwnProperty('transitionMode') && (userStore.preferences.mainPage.transitionMode = 'fade')" />
        </FaTooltip>
        <FaTooltip text="向左滑动" :delay="500">
          <div class="mode mode-slide-left" :class="{ active: userStore.preferences.mainPage.transitionMode === 'slide-left' }" @click="userStore.preferences.mainPage?.hasOwnProperty('transitionMode') && (userStore.preferences.mainPage.transitionMode = 'slide-left')" />
        </FaTooltip>
        <FaTooltip text="向右滑动" :delay="500">
          <div class="mode mode-slide-right" :class="{ active: userStore.preferences.mainPage.transitionMode === 'slide-right' }" @click="userStore.preferences.mainPage?.hasOwnProperty('transitionMode') && (userStore.preferences.mainPage.transitionMode = 'slide-right')" />
        </FaTooltip>
        <FaTooltip text="向上滑动" :delay="500">
          <div class="mode mode-slide-top" :class="{ active: userStore.preferences.mainPage.transitionMode === 'slide-top' }" @click="userStore.preferences.mainPage?.hasOwnProperty('transitionMode') && (userStore.preferences.mainPage.transitionMode = 'slide-top')" />
        </FaTooltip>
        <FaTooltip text="向下滑动" :delay="500">
          <div class="mode mode-slide-bottom" :class="{ active: userStore.preferences.mainPage.transitionMode === 'slide-bottom' }" @click="userStore.preferences.mainPage?.hasOwnProperty('transitionMode') && (userStore.preferences.mainPage.transitionMode = 'slide-bottom')" />
        </FaTooltip>
      </div>
    </div>
    <div
      v-if="
        (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('mainMenuClickMode'))
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuUniqueOpened'))
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuCollapse'))
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuAutoCollapse'))
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('enableSubMenuCollapseButton'))
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('style'))
      "
    >
      <div class="divider">
        导航栏
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('mainMenuClickMode')" class="setting-item">
        <div class="label">
          主导航点击模式
          <FaTooltip text="智能选择会判断次导航是否只有且只有一个可访问的菜单进行切换或跳转操作">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { label: '切换', value: 'switch' },
              { label: '跳转', value: 'jump' },
              { label: '智能选择', value: 'smart' },
            ]" :key="index" :variant="userStore.preferences.menu.mainMenuClickMode === item.value ? 'default' : 'outline'" size="sm" :disabled="!['single', 'side', 'head'].includes(userStore.preferences.menu?.mode!)" @click="userStore.preferences.menu.mainMenuClickMode = (item.value as any)"
          >
            {{ item.label }}
          </FaButton>
        </div>
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuUniqueOpened')" class="setting-item">
        <div class="label">
          次导航保持展开一个
          <FaTooltip text="次导航只保持单个菜单的展开">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.menu.subMenuUniqueOpened" :disabled="['only-side', 'only-head'].includes(userStore.preferences.menu?.mode!)" />
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuCollapse')" class="setting-item">
        <div class="label">
          次导航是否收起
        </div>
        <FaSwitch v-model="userStore.preferences.menu.subMenuCollapse" :disabled="['only-side', 'only-head'].includes(userStore.preferences.menu?.mode!)" />
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('subMenuAutoCollapse')" class="setting-item">
        <div class="label">
          次导航是否自动收起
          <FaTooltip text="次导航收起时，鼠标悬停会临时展开">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.menu.subMenuAutoCollapse" :disabled="['only-side', 'only-head'].includes(userStore.preferences.menu?.mode!)" />
      </div>
      <div v-if="settingsStore.mode === 'pc' && userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('enableSubMenuCollapseButton')" class="setting-item">
        <div class="label">
          显示次导航展开/收起按钮
        </div>
        <FaSwitch v-model="userStore.preferences.menu.enableSubMenuCollapseButton" :disabled="['only-side', 'only-head'].includes(userStore.preferences.menu?.mode!)" />
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.menu?.hasOwnProperty('style')" class="setting-item">
        <div class="label">
          风格
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { icon: 'i-jam:stop-sign', value: '' },
              { icon: ['head', 'only-head', 'head-panel'].includes(userStore.preferences.menu.mode!) ? 'i-ep:caret-top' : 'i-ep:caret-left', value: 'arrow' },
              { icon: ['side', 'only-side', 'side-panel'].includes(userStore.preferences.menu.mode!) ? 'i-tabler:minus-vertical' : 'i-tabler:minus', value: 'line' },
              { icon: 'i-icon-park-outline:dot', value: 'dot' },
            ]" :key="index" :variant="userStore.preferences.menu.style === item.value ? 'default' : 'outline'" size="icon" class="h-7 w-7" :disabled="userStore.preferences.menu.mode === 'single'" @click="userStore.preferences.menu.style = (item.value as any)"
          >
            <FaIcon :name="item.icon" />
          </FaButton>
        </div>
      </div>
    </div>
    <div v-if="userStore.preferences.topbar?.hasOwnProperty('mode') || userStore.preferences.topbar?.hasOwnProperty('switchTabbarAndToolbar')">
      <div class="divider">
        顶栏
      </div>
      <div v-if="userStore.preferences.topbar?.hasOwnProperty('mode')" class="setting-item">
        <div class="label">
          模式
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { label: '静止', value: 'static' },
              { label: '固定', value: 'fixed' },
              { label: '粘性', value: 'sticky' },
            ]" :key="index" :variant="userStore.preferences.topbar.mode === item.value ? 'default' : 'outline'" size="sm" @click="userStore.preferences.topbar.mode = (item.value as any)"
          >
            {{ item.label }}
          </FaButton>
        </div>
      </div>
      <div v-if="userStore.preferences.topbar?.hasOwnProperty('switchTabbarAndToolbar')" class="setting-item">
        <div class="label">
          展示切换
          <FaTooltip text="切换标签栏和工具栏的展示顺序">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.topbar.switchTabbarAndToolbar" :disabled="!userStore.preferences.tabbar?.enable" />
      </div>
    </div>
    <div
      v-if="
        userStore.preferences.tabbar?.hasOwnProperty('style')
          || userStore.preferences.tabbar?.hasOwnProperty('enableIcon')
          || userStore.preferences.tabbar?.hasOwnProperty('dblclickAction')
          || userStore.preferences.tabbar?.hasOwnProperty('enableMemory')
      "
    >
      <div class="divider">
        标签栏
      </div>
      <div v-if="userStore.preferences.tabbar?.hasOwnProperty('style')" class="setting-item">
        <div class="label">
          风格
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { label: '默认', value: '' },
              { label: '时尚', value: 'fashion' },
              { label: '卡片', value: 'card' },
              { label: '方块', value: 'square' },
            ]" :key="index" :variant="userStore.preferences.tabbar.style === item.value ? 'default' : 'outline'" size="sm" :disabled="!userStore.preferences.tabbar?.enable" @click="userStore.preferences.tabbar.style = (item.value as any)"
          >
            {{ item.label }}
          </FaButton>
        </div>
      </div>
      <div v-if="userStore.preferences.tabbar?.hasOwnProperty('enableIcon')" class="setting-item">
        <div class="label">
          是否显示图标
        </div>
        <FaSwitch v-model="userStore.preferences.tabbar.enableIcon" />
      </div>
      <div v-if="userStore.preferences.tabbar?.hasOwnProperty('dblclickAction')" class="setting-item">
        <div class="label">
          标签页双击执行动作
        </div>
        <FaSelect
          v-model="userStore.preferences.tabbar.dblclickAction" :options="[
            { label: '刷新', value: 'reload' },
            { label: '关闭', value: 'close' },
            { label: '固定/取消固定', value: 'pin' },
            { label: '最大化', value: 'maximize' },
            { label: '新窗口打开', value: 'window' },
          ]"
        />
      </div>
      <div v-if="userStore.preferences.tabbar?.hasOwnProperty('enableMemory')" class="setting-item">
        <div class="label">
          是否启用记忆功能
          <FaTooltip text="非固定和非常驻的标签页将在本次会话窗口中始终存在，刷新浏览器或重新登录时不会丢失">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.tabbar.enableMemory" />
      </div>
    </div>
    <div
      v-if="
        userStore.preferences.toolbar?.hasOwnProperty('breadcrumb')
          || userStore.preferences.toolbar?.hasOwnProperty('navSearch')
          || userStore.preferences.toolbar?.hasOwnProperty('fullscreen')
          || userStore.preferences.toolbar?.hasOwnProperty('pageReload')
          || userStore.preferences.toolbar?.hasOwnProperty('colorScheme')
          || userStore.preferences.toolbar?.hasOwnProperty('layout')
      "
    >
      <div class="divider">
        工具栏
      </div>
      <div v-if="settingsStore.mode === 'pc' && userStore.preferences.toolbar?.hasOwnProperty('breadcrumb')" class="setting-item">
        <div class="label">
          面包屑导航
        </div>
        <FaSwitch v-model="userStore.preferences.toolbar.breadcrumb" />
      </div>
      <div v-if="userStore.preferences.toolbar?.hasOwnProperty('navSearch')" class="setting-item">
        <div class="label">
          导航搜索
          <FaTooltip text="对导航进行快捷搜索">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.toolbar.navSearch" />
      </div>
      <div v-if="settingsStore.mode === 'pc' && userStore.preferences.toolbar?.hasOwnProperty('fullscreen')" class="setting-item">
        <div class="label">
          全屏
        </div>
        <FaSwitch v-model="userStore.preferences.toolbar.fullscreen" />
      </div>
      <div v-if="userStore.preferences.toolbar?.hasOwnProperty('pageReload')" class="setting-item">
        <div class="label">
          页面刷新
          <FaTooltip text="使用框架内提供的刷新功能进行页面刷新">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.toolbar.pageReload" />
      </div>
      <div v-if="userStore.preferences.toolbar?.hasOwnProperty('colorScheme')" class="setting-item">
        <div class="label">
          颜色主题
          <FaTooltip text="可切换明亮/暗黑模式">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.toolbar.colorScheme" />
      </div>
      <div v-if="userStore.preferences.toolbar?.hasOwnProperty('layout')" ref="toolbarLayoutRef" class="mx-4 my-2 flex items-center border rounded-2 px-2 py-1">
        <span
          v-for="tool in userStore.preferences.toolbar.layout" :key="tool" class="draggable flex items-center justify-center p-1" :class="{
            'flex-1 text-secondary-foreground/50 no-drag': tool === '->',
            'cursor-ew-resize': tool !== '->',
            'pointer-events-none w-0 op-0 p-[0]! no-drag': tool !== '->' && !settingsStore.settings.toolbar[tool],
          }"
        >
          <FaIcon v-if="tool === 'favorites'" name="i-uiw:star-off" />
          <FaIcon v-if="tool === 'breadcrumb'" name="i-ic:twotone-double-arrow" :rotate="settingsStore.settings.app.direction === 'rtl' ? 180 : 0" />
          <FaIcon v-if="tool === 'navSearch'" name="i-ri:search-line" />
          <FaIcon v-if="tool === 'notification'" name="i-ri:notification-3-line" />
          <FaIcon v-if="tool === 'i18n'" name="i-ri:translate" />
          <FaIcon v-if="tool === 'fullscreen'" name="i-ri:fullscreen-line" />
          <FaIcon v-if="tool === 'pageReload'" name="i-iconoir:refresh-double" />
          <FaIcon v-if="tool === 'colorScheme'" name="i-ri:sun-line" />
          <span v-if="tool === '->'" class="pointer-events-none text-sm">布局调整</span>
        </span>
      </div>
    </div>
    <div
      v-if="
        settingsStore.mode === 'pc' && (
          userStore.preferences.breadcrumb?.hasOwnProperty('style')
          || (userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.breadcrumb?.hasOwnProperty('enableMainMenu'))
        )
      "
    >
      <div class="divider">
        面包屑导航
      </div>
      <div v-if="userStore.preferences.breadcrumb?.hasOwnProperty('style')" class="setting-item">
        <div class="label">
          风格
        </div>
        <div class="flex-center-start gap-1">
          <FaButton
            v-for="(item, index) in [
              { label: '默认', value: '' },
              { label: '现代', value: 'modern' },
            ]" :key="index" :variant="userStore.preferences.breadcrumb.style === item.value ? 'default' : 'outline'" size="sm" :disabled="!userStore.preferences.toolbar?.breadcrumb" @click="userStore.preferences.breadcrumb.style = (item.value as any)"
          >
            {{ item.label }}
          </FaButton>
        </div>
      </div>
      <div v-if="userStore.preferences.menu?.hasOwnProperty('mode') && userStore.preferences.breadcrumb?.hasOwnProperty('enableMainMenu')" class="setting-item">
        <div class="label">
          是否显示主导航
        </div>
        <FaSwitch v-model="userStore.preferences.breadcrumb.enableMainMenu" :disabled="['single'].includes(userStore.preferences.menu?.mode!)" />
      </div>
    </div>
    <div v-if="userStore.preferences.app?.hasOwnProperty('enableProgress') || userStore.preferences.app?.hasOwnProperty('enableColorAmblyopiaMode')">
      <div class="divider">
        其它
      </div>
      <div class="setting-item">
        <div class="label">
          载入进度条
          <FaTooltip text="该功能开启时，跳转路由会看到页面顶部有进度条">
            <FaIcon name="i-ri:question-line" />
          </FaTooltip>
        </div>
        <FaSwitch v-model="userStore.preferences.app.enableProgress" />
      </div>
      <div class="setting-item">
        <div class="label">
          色弱模式
        </div>
        <FaSwitch v-model="userStore.preferences.app.enableColorAmblyopiaMode" />
      </div>
    </div>
    <template #footer>
      <FaButton class="w-full" @click="handleReset">
        重置
      </FaButton>
    </template>
  </FaDrawer>
</template>

<style scoped>
.divider {
  --uno: flex items-center justify-between gap-4 my-4 whitespace-nowrap text-sm font-500;

  &::before,
  &::after {
    --uno: content-empty w-full h-1px bg-border;
  }
}

.themes {
  --uno: grid grid-cols-4 gap-4 pb-4 p-inline-8;

  .theme {
    --uno: flex place-self-center items-center justify-center w-full h-12 rounded-2 ring-1 ring-border cursor-pointer transition;

    &.active {
      --uno: ring-primary ring-2;

      .content {
        --uno: rotate-0;
      }
    }

    .content {
      --uno: w-6 h-4 rounded-1/2 -rotate-45 transition;
    }
  }
}

.menu-mode {
  --uno: flex items-center justify-center gap-4 pb-4;

  .mode {
    --uno: relative w-16 h-12 rounded-2 ring-1 ring-border cursor-pointer transition;

    &.active {
      --uno: ring-primary ring-2;
    }

    &::before,
    &::after,
    .mode-container {
      --uno: absolute pointer-events-none;
    }

    &::before {
      --uno: content-empty bg-primary;
    }

    &::after {
      --uno: content-empty bg-primary/60;
    }

    .mode-container {
      --uno: bg-primary/20 border-width-1.5 border-dashed border-primary;

      &::before {
        --uno: content-empty absolute w-full h-full;
      }
    }

    &-side {
      &::before {
        --uno: top-2 bottom-2 start-2 w-2 rounded-ss-1 rounded-es-1;
      }

      &::after {
        --uno: top-2 bottom-2 start-4.5 w-3;
      }

      .mode-container {
        --uno: inset-t-2 inset-e-2 inset-b-2 inset-s-8 rounded-se-1 rounded-ee-1;
      }
    }

    &-head {
      &::before {
        --uno: top-2 start-2 end-2 h-2 rounded-ss-1 rounded-se-1;
      }

      &::after {
        --uno: top-4.5 start-2 bottom-2 w-3 rounded-es-1;
      }

      .mode-container {
        --uno: inset-t-4.5 inset-e-2 inset-b-2 inset-s-5.5 rounded-ee-1;
      }
    }

    &-single {
      &::after {
        --uno: top-2 start-2 bottom-2 w-3 rounded-ss-1 rounded-es-1;
      }

      .mode-container {
        --uno: inset-t-2 inset-e-2 inset-b-2 inset-s-5.5 rounded-se-1 rounded-ee-1;
      }
    }

    &-only-side {
      &::before {
        --uno: top-2 bottom-2 start-2 w-2 rounded-ss-1 rounded-es-1;
      }

      .mode-container {
        --uno: inset-t-2 inset-e-2 inset-b-2 inset-s-4.5 rounded-se-1 rounded-ee-1;
      }
    }

    &-only-head {
      &::before {
        --uno: top-2 start-2 end-2 h-2 rounded-ss-1 rounded-se-1;
      }

      .mode-container {
        --uno: inset-t-4.5 inset-e-2 inset-b-2 inset-s-2 rounded-es-1 rounded-ee-1;
      }
    }

    &-side-panel {
      &::before {
        --uno: top-2 bottom-2 start-2 w-2 rounded-ss-1 rounded-es-1;
      }

      &::after {
        --uno: top-4 bottom-4 start-5.5 w-5;
      }

      .mode-container {
        --uno: inset-t-2 inset-e-2 inset-b-2 inset-s-4.5 rounded-se-1 rounded-ee-1;
      }
    }

    &-head-panel {
      &::before {
        --uno: top-2 start-2 end-2 h-2 rounded-ss-1 rounded-se-1;
      }

      &::after {
        --uno: top-5.5 bottom-3.5 start-5 w-6;
      }

      .mode-container {
        --uno: inset-t-4.5 inset-e-2 inset-b-2 inset-s-2 rounded-es-1 rounded-ee-1;
      }
    }
  }
}

.app-width-mode {
  --uno: flex items-center justify-center gap-4 pb-4;

  .mode {
    --uno: relative w-16 h-12 rounded-2 ring-1 ring-border cursor-pointer transition of-hidden;

    &.active {
      --uno: ring-primary ring-2;
    }

    &-adaption {
      &::before {
        --uno: content-empty absolute w-full h-full bg-primary/20;
      }

      .left,
      .right {
        --uno: absolute top-1/2 -translate-y-1/2;
      }

      .left {
        --uno: left-1;
      }

      .right {
        --uno: right-1;
      }
    }

    &-adaption-min-width {
      &::before {
        --uno: content-empty absolute w-1/2 h-full left-1/2 -translate-x-1/2 bg-primary/20;
      }

      .left,
      .right {
        --uno: absolute top-1/2 -translate-y-1/2;
      }

      .left {
        --uno: left-0.5;
      }

      .right {
        --uno: right-0.5;
      }
    }

    &-center {
      &::before {
        --uno: content-empty absolute w-3/5 h-full left-1/2 -translate-x-1/2 bg-primary/20;
      }
    }

    &-center-max-width {
      &::before {
        --uno: content-empty absolute w-3/5 h-full left-1/2 -translate-x-1/2 bg-primary/20;
      }

      .left,
      .right {
        --uno: absolute top-1/2 -translate-y-1/2;
      }

      .left {
        --uno: left-2.5;
      }

      .right {
        --uno: right-2.5;
      }
    }
  }
}

.transition-mode {
  --uno: flex items-center justify-center gap-4 pb-4;

  .mode {
    --uno: relative flex items-center justify-center w-14 h-10 rounded-2 ring-1 ring-border cursor-pointer;

    &.active {
      --uno: ring-primary ring-2;
    }

    &::after {
      --uno: content-empty absolute w-3/5 h-3/5 top-1/5 left-1/5 rounded-2 bg-primary/20 transition;
    }

    &.mode-fade {
      &::after {
        animation: transition-mode-fade-after 1.5s infinite;
      }

      @keyframes transition-mode-fade-after {
        0% {
          opacity: 1;
        }

        30%,
        35% {
          opacity: 0;
        }

        65% {
          opacity: 1;
        }
      }
    }

    &.mode-slide-left {
      &::after {
        animation: transition-mode-slide-left 1.5s infinite;
      }

      @keyframes transition-mode-slide-left {
        0% {
          opacity: 1;
        }

        30% {
          opacity: 0;
          transform: translate(-30%, 0);
        }

        35% {
          opacity: 0;
          transform: translate(30%, 0);
        }

        65% {
          opacity: 1;
        }
      }
    }

    &.mode-slide-right {
      &::after {
        animation: transition-mode-slide-right 1.5s infinite;
      }

      @keyframes transition-mode-slide-right {
        0% {
          opacity: 1;
        }

        30% {
          opacity: 0;
          transform: translate(30%, 0);
        }

        35% {
          opacity: 0;
          transform: translate(-30%, 0);
        }

        100% {
          opacity: 1;
        }
      }
    }

    &.mode-slide-top {
      &::after {
        animation: transition-mode-slide-top 1.5s infinite;
      }

      @keyframes transition-mode-slide-top {
        0% {
          opacity: 1;
        }

        30% {
          opacity: 0;
          transform: translate(0, -30%);
        }

        35% {
          opacity: 0;
          transform: translate(0, 30%);
        }

        100% {
          opacity: 1;
        }
      }
    }

    &.mode-slide-bottom {
      &::after {
        animation: transition-mode-slide-bottom 1.5s infinite;
      }

      @keyframes transition-mode-slide-bottom {
        0% {
          opacity: 1;
        }

        30% {
          opacity: 0;
          transform: translate(0, 30%);
        }

        35% {
          opacity: 0;
          transform: translate(0, -30%);
        }

        100% {
          opacity: 1;
        }
      }
    }
  }
}

.setting-item {
  --uno: flex items-center justify-between gap-4 px-4 py-2 rounded-lg transition hover-bg-secondary;

  .label {
    --uno: flex items-center flex-shrink-0 gap-2 text-sm;

    i {
      --uno: text-xl text-orange cursor-help;
    }
  }
}
</style>
