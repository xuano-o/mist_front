<i18n lang="yaml">
zh-cn:
  input: 支持标题、拼音(首字母)、URL模糊查询
  welcome: 输入你要搜索的导航
  empty: 没有找到你想要的
  up_down: 切换
  enter: 访问
  esc: 退出
zh-tw:
  input: 支持標題、拼音(首字母)、URL模糊查詢
  welcome: 輸入你要搜索的導航
  empty: 沒有找到你想要的
  up_down: 切換
  enter: 訪問
  esc: 退出
en:
  input: Support title, URL fuzzy query
  welcome: Enter the navigation you want to search
  empty: Not found
  up_down: Choice
  enter: Enter
  esc: Exit
</i18n>

<script setup lang="ts">
import type { Menu } from '#/global'
import Breadcrumb from '@/layouts/components/Breadcrumb/index.vue'
import BreadcrumbItem from '@/layouts/components/Breadcrumb/item.vue'
import useMenuStore from '@/store/modules/menu'
import useSettingsStore from '@/store/modules/settings'
import { resolveRoutePath } from '@/utils'
import { cloneDeep } from 'es-toolkit'
import hotkeys from 'hotkeys-js'
import { match } from 'pinyin-pro'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'Search',
})

const isShow = defineModel<boolean>({
  default: false,
})

const { t } = useI18n()

const router = useRouter()
const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const { generateI18nTitle } = useMenu()

interface listTypes {
  path: string
  query?: Record<string, any>
  icon?: string
  title?: string | (() => string)
  link?: string
  breadcrumb: {
    title?: string | (() => string)
  }[]
}

const searchInput = ref('')
const sourceList = ref<listTypes[]>([])
const actived = ref(-1)

const searchResultRef = useTemplateRef('searchResultRef')
const searchResultItemRef = useTemplateRef<HTMLElement[]>('searchResultItemRef')

const resultList = computed(() => {
  let result = []
  result = sourceList.value.filter((item) => {
    let flag = false
    if (searchInput.value !== '') {
      if (item.path.includes(searchInput.value)) {
        flag = true
      }
      if (
        generateI18nTitle(item.title).toString().includes(searchInput.value)
        || (match(generateI18nTitle(item.title).toString(), searchInput.value, { continuous: true })?.length ?? 0) > 0
      ) {
        flag = true
      }
      if (item.breadcrumb.some((b) => {
        return generateI18nTitle(b.title).toString().includes(searchInput.value)
          || (match(generateI18nTitle(b.title).toString(), searchInput.value, { continuous: true })?.length ?? 0) > 0
      })) {
        flag = true
      }
    }
    return flag
  })
  return result
})

watch(() => isShow.value, (val) => {
  if (val) {
    searchInput.value = ''
    actived.value = -1
    // 当搜索显示的时候绑定上、下、回车快捷键，隐藏的时候再解绑。另外当 input 处于 focus 状态时，采用 vue 来绑定键盘事件
    hotkeys('up', keyUp)
    hotkeys('down', keyDown)
    hotkeys('enter', keyEnter)
    hotkeys('esc', (e) => {
      if (settingsStore.settings.navSearch.enableHotkeys) {
        e.preventDefault()
        isShow.value = false
      }
    })
  }
  else {
    hotkeys.unbind('up', keyUp)
    hotkeys.unbind('down', keyDown)
    hotkeys.unbind('enter', keyEnter)
    hotkeys.unbind('esc')
  }
})
watch(() => resultList.value, () => {
  actived.value = -1
  handleScroll()
})

onMounted(() => {
  initSourceList()
  hotkeys('command+k, ctrl+k', (e) => {
    if (settingsStore.settings.navSearch.enableHotkeys) {
      e.preventDefault()
      isShow.value = true
    }
  })
})

onUnmounted(() => {
  hotkeys.unbind('command+k, ctrl+k')
})

function initSourceList() {
  sourceList.value = []
  menuStore.allMenus.forEach((item) => {
    getSourceList(item.children)
  })
}

function hasChildren(item: Menu.recordRaw) {
  let flag = true
  if (item.children?.every(i => i.meta?.menu === false)) {
    flag = false
  }
  return flag
}
function getSourceList(arr: Menu.recordRaw[], basePath?: string, icon?: string, breadcrumb?: { title?: string | (() => string), i18n?: string }[]) {
  arr.forEach((item) => {
    if (item.meta?.menu !== false) {
      const breadcrumbTemp = cloneDeep(breadcrumb) || []
      if (item.children && hasChildren(item)) {
        breadcrumbTemp.push({
          title: item.meta?.title,
        })
        getSourceList(item.children, resolveRoutePath(basePath, item.path), item.meta?.icon ?? icon, breadcrumbTemp)
      }
      else {
        breadcrumbTemp.push({
          title: item.meta?.title,
        })
        sourceList.value.push({
          path: resolveRoutePath(basePath, item.path),
          query: item.meta?.query,
          icon: item.meta?.icon ?? icon,
          title: item.meta?.title,
          link: item.meta?.link,
          breadcrumb: breadcrumbTemp,
        })
      }
    }
  })
}

function keyUp() {
  if (resultList.value.length) {
    actived.value -= 1
    if (actived.value < 0) {
      actived.value = resultList.value.length - 1
    }
    handleScroll()
  }
}
function keyDown() {
  if (resultList.value.length) {
    actived.value += 1
    if (actived.value > resultList.value.length - 1) {
      actived.value = 0
    }
    handleScroll()
  }
}
function keyEnter() {
  if (actived.value !== -1) {
    searchResultItemRef.value?.find(item => Number.parseInt(item.dataset.index!) === actived.value)?.click()
  }
}
function handleScroll() {
  if (searchResultRef.value?.areaRef?.ref?.el?.viewportElement) {
    const contentDom = searchResultRef.value.areaRef.ref.el.viewportElement
    let scrollTo = 0
    if (actived.value !== -1) {
      scrollTo = contentDom.scrollTop
      const activedOffsetTop = searchResultItemRef.value?.find(item => Number.parseInt(item.dataset.index!) === actived.value)?.offsetTop ?? 0
      const activedClientHeight = searchResultItemRef.value?.find(item => Number.parseInt(item.dataset.index!) === actived.value)?.clientHeight ?? 0
      const searchScrollTop = contentDom.scrollTop
      const searchClientHeight = contentDom.clientHeight
      if (activedOffsetTop + activedClientHeight > searchScrollTop + searchClientHeight) {
        scrollTo = activedOffsetTop + activedClientHeight - searchClientHeight
      }
      else if (activedOffsetTop <= searchScrollTop) {
        scrollTo = activedOffsetTop - 16
      }
    }
    contentDom.scrollTo({
      top: scrollTo,
    })
  }
}

function pageJump(path: listTypes['path'], query: listTypes['query'], link: listTypes['link']) {
  if (link) {
    window.open(link, '_blank')
  }
  else {
    router.push({
      path,
      query,
    })
  }
  isShow.value = false
}
</script>

<template>
  <FaModal ref="searchResultRef" v-model="isShow" border :footer="settingsStore.mode === 'pc'" :closable="false" class="w-full lg-max-w-2xl" content-class="flex flex-col p-0 min-h-auto" header-class="p-0" footer-class="p-0">
    <template #header>
      <div class="h-12 flex flex-shrink-0 items-center">
        <div class="h-full w-14 flex-center">
          <FaIcon name="i-ri:search-line" class="size-4 text-foreground/30" />
        </div>
        <input v-model="searchInput" :placeholder="t('input')" class="h-full w-full border-0 rounded-md bg-transparent text-base text-foreground focus-outline-none placeholder-foreground/30" @keydown.esc="isShow = false" @keydown.up.prevent="keyUp" @keydown.down.prevent="keyDown" @keydown.enter.prevent="keyEnter">
        <div v-if="settingsStore.mode === 'mobile'" class="h-full w-14 flex-center border-s">
          <FaIcon name="i-carbon:close" class="size-4" @click="isShow = false" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-between px-4 py-3">
        <div class="flex gap-8">
          <div class="inline-flex items-center gap-1 text-xs">
            <FaKbd>
              <FaIcon name="i-ion:md-return-left" class="size-4" />
            </FaKbd>
            <span>{{ t('enter') }}</span>
          </div>
          <div class="inline-flex items-center gap-1 text-xs">
            <FaKbd>
              <FaIcon name="i-ant-design:caret-up-filled" class="size-4" />
            </FaKbd>
            <FaKbd>
              <FaIcon name="i-ant-design:caret-down-filled" class="size-4" />
            </FaKbd>
            <span>{{ t('up_down') }}</span>
          </div>
        </div>
        <div v-if="settingsStore.settings.navSearch.enableHotkeys" class="inline-flex items-center gap-1 text-xs">
          <FaKbd>
            ESC
          </FaKbd>
          <span>{{ t('esc') }}</span>
        </div>
      </div>
    </template>
    <div>
      <template v-if="resultList.length > 0">
        <div v-for="(item, index) in resultList" ref="searchResultItemRef" :key="item.path" class="p-4" :data-index="index" @click="pageJump(item.path, item.query, item.link)" @mouseover="actived = index">
          <a class="flex cursor-pointer items-center border rounded-lg" :class="{ '-mt-4': index !== 0, 'bg-accent': index === actived }">
            <FaIcon v-if="item.icon" :name="item.icon" class="size-5 basis-16 transition" :class="{ 'scale-120 text-primary': index === actived }" />
            <div class="flex flex-1 flex-col gap-1 truncate border-s px-4 py-3">
              <div class="truncate text-start text-base font-bold">{{ generateI18nTitle(item.title) }}</div>
              <Breadcrumb v-if="item.breadcrumb.length" class="truncate">
                <BreadcrumbItem v-for="(bc, bcIndex) in item.breadcrumb" :key="bcIndex" class="text-xs">
                  {{ generateI18nTitle(bc.title) }}
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </a>
        </div>
      </template>
      <template v-else-if="searchInput === ''">
        <div class="h-full flex-col-center py-6 text-secondary-foreground/50">
          <FaIcon name="i-tabler:mood-smile" class="size-10" />
          <p class="m-2 text-base">
            {{ t('welcome') }}
          </p>
        </div>
      </template>
      <template v-else>
        <div class="h-full flex-col-center py-6 text-secondary-foreground/50">
          <FaIcon name="i-tabler:mood-empty" class="size-10" />
          <p class="m-2 text-base">
            {{ t('empty') }}
          </p>
        </div>
      </template>
    </div>
  </FaModal>
</template>
