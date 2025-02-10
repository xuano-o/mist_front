<script setup lang="ts">
import useIframeStore from '@/store/modules/iframe'
import useSettingsStore from '@/store/modules/settings'

defineOptions({
  name: 'IframeView',
})

const route = useRoute()

const settingsStore = useSettingsStore()
const iframeStore = useIframeStore()
const { setCustomTitle } = useMainPage()
const { generateI18nTitle } = useMenu()

const iframeRef = useTemplateRef<HTMLIFrameElement[]>('iframeRef')

watch(() => route.fullPath, (val) => {
  nextTick(() => {
    iframeRef.value?.forEach((item: HTMLIFrameElement) => {
      if (item.dataset.path === val) {
        const title = iframeStore.openedList.find(i => i.path === val)?.title
        title && setCustomTitle(generateI18nTitle(title))
        item.onload = () => {
          iframeStore.closeLoading(val)
        }
      }
    })
  })
}, {
  immediate: true,
})
</script>

<template>
  <div class="iframe-view absolute left-0 top-0 h-full w-full flex flex-col">
    <div v-for="item in iframeStore.openedList" :key="item.path" class="absolute left-0 top-0 h-full w-full flex flex-col" :class="{ 'z-1': route.fullPath === item.path }">
      <Transition :name="settingsStore.settings.mainPage.enableTransition ? settingsStore.settings.mainPage.transitionMode : ''" mode="out-in" appear>
        <iframe v-show="route.fullPath === item.path" ref="iframeRef" :data-path="item.path" :src="item.src" frameborder="0" class="h-full w-full flex-1" />
      </Transition>
      <div v-show="item.isLoading" class="absolute left-0 top-0 h-full w-full flex-center bg-popover/75">
        <FaIcon name="i-line-md:loading-twotone-loop" class="size-10" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.slide-left-enter-active,
.slide-right-enter-active,
.slide-top-enter-active,
.slide-bottom-enter-active {
  transition: 0.4s;
}

.fade-leave-active,
.slide-left-leave-active,
.slide-right-leave-active,
.slide-top-leave-active,
.slide-bottom-leave-active {
  transition: 0.3s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-from {
  margin-left: 20px;
  opacity: 0;
}

.slide-left-leave-to {
  margin-left: -20px;
  opacity: 0;
}

.slide-right-enter-from {
  margin-left: -20px;
  opacity: 0;
}

.slide-right-leave-to {
  margin-left: 20px;
  opacity: 0;
}

.slide-top-enter-from {
  margin-top: 20px;
  opacity: 0;
}

.slide-top-leave-to {
  margin-top: -20px;
  opacity: 0;
}

.slide-bottom-enter-from {
  margin-top: -20px;
  opacity: 0;
}

.slide-bottom-leave-to {
  margin-top: 20px;
  opacity: 0;
}
</style>
