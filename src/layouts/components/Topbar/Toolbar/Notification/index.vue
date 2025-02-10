<script setup lang="ts">
import useNotificationStore from '@/store/modules/notification'
import Panel from './panel.vue'

defineOptions({
  name: 'Notification',
})

const notificationStore = useNotificationStore()

notificationStore.init()
</script>

<template>
  <FaPopover class="p-0">
    <FaButton variant="ghost" size="icon" class="animation">
      <FaBadge :value="notificationStore.total > 9 ? true : notificationStore.total">
        <FaIcon name="i-ri:notification-3-line" class="icon size-4" />
      </FaBadge>
    </FaButton>
    <template #panel>
      <Panel />
    </template>
  </FaPopover>
</template>

<style scoped>
.animation {
  .icon {
    transform-origin: center top;
  }

  &:hover .icon {
    animation: animation 1s;
  }
}

@keyframes animation {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}
</style>
