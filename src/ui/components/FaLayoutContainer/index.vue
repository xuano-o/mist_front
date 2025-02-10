<script setup lang="ts">
defineOptions({
  name: 'FaLayoutContainer',
})

const props = withDefaults(
  defineProps<{
    enableLeftSide?: boolean
    enableRightSide?: boolean
    leftSideWidth?: number | string
    rightSideWidth?: number | string
    hideLeftSideToggle?: boolean
    hideRightSideToggle?: boolean
  }>(),
  {
    enableLeftSide: true,
    enableRightSide: true,
    leftSideWidth: 300,
    rightSideWidth: 300,
    hideLeftSideToggle: false,
    hideRightSideToggle: false,
  },
)

const slots = defineSlots<{
  leftSide?: () => VNode
  rightSide?: () => VNode
  default?: () => VNode
}>()

// 侧边栏是否折叠
const leftSideVisiable = defineModel('leftSideVisiable', {
  type: Boolean,
  default: true,
})
const rightSideVisiable = defineModel('rightSideVisiable', {
  type: Boolean,
  default: true,
})

const enabledLeftSide = computed(() => {
  return props.enableLeftSide && !!slots.leftSide
})
const enabledRightSide = computed(() => {
  return props.enableRightSide && !!slots.rightSide
})
</script>

<template>
  <div class="flex-container">
    <div
      v-if="enabledLeftSide" v-show="leftSideVisiable" class="left-side border rounded-lg bg-background transition-background-color-300" :style="{
        width: typeof leftSideWidth === 'number' ? `${leftSideWidth}px` : leftSideWidth,
      }"
    >
      <slot name="leftSide" />
    </div>
    <div class="main">
      <div v-if="enabledLeftSide && !hideLeftSideToggle" class="group left-side-icon absolute top-1/2 z-1 h-6 w-6 flex-center cursor-pointer border-l border-t rounded-1/2 bg-background -left-3 -rotate-45" @click="leftSideVisiable = !leftSideVisiable">
        <FaIcon :name="leftSideVisiable ? 'i-ep:caret-left' : 'i-ep:caret-right'" class="rotate-45 op-30 transition-opacity group-hover-op-100" />
      </div>
      <div v-if="enabledRightSide && !hideRightSideToggle" class="group right-side-icon absolute top-1/2 z-1 h-6 w-6 flex-center cursor-pointer border-b border-r rounded-1/2 bg-background -right-3 -rotate-45" @click="rightSideVisiable = !rightSideVisiable">
        <FaIcon :name="rightSideVisiable ? 'i-ep:caret-right' : 'i-ep:caret-left'" class="rotate-45 op-30 transition-opacity group-hover-op-100" />
      </div>
      <div class="main-container border rounded-lg bg-background transition-background-color-300">
        <slot name="default" />
      </div>
    </div>
    <div
      v-if="enabledRightSide" v-show="rightSideVisiable" class="right-side border rounded-lg bg-background transition-background-color-300" :style="{
        width: typeof rightSideWidth === 'number' ? `${rightSideWidth}px` : rightSideWidth,
      }"
    >
      <slot name="rightSide" />
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  position: absolute;
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;

  .left-side,
  .right-side,
  .main {
    --container-padding: 15px;

    height: 100%;
    padding: var(--container-padding);
  }

  .left-side,
  .right-side {
    flex: none;
    overflow: auto;
  }

  .main {
    position: relative;
    flex: 1;
    width: 100%;

    .main-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: var(--container-padding);
      overflow: auto;
    }
  }
}
</style>
