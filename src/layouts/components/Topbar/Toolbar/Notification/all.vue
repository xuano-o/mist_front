<script setup lang="ts">
import useNotificationStore from '@/store/modules/notification'

const notificationStore = useNotificationStore()

function messagePlus() {
  notificationStore.$patch((state) => {
    state.message += 1
  })
}
function messageMinus() {
  notificationStore.$patch((state) => {
    state.message -= state.message > 0 ? 1 : 0
  })
}

function todoPlus() {
  notificationStore.$patch((state) => {
    state.todo += 1
  })
}
function todoMinus() {
  notificationStore.$patch((state) => {
    state.todo -= state.todo > 0 ? 1 : 0
  })
}
</script>

<template>
  <div>
    <FaDivider>
      消息
    </FaDivider>
    <div class="flex-center">
      <FaButton @click="messagePlus">
        <FaIcon name="i-ep:plus" />
        1
      </FaButton>
      <FaButton ml-2 @click="messageMinus">
        <FaIcon name="i-ep:minus" />
        1
      </FaButton>
    </div>
    <FaDivider>
      待办
    </FaDivider>
    <div class="flex-center">
      <FaButton @click="todoPlus">
        <FaIcon name="i-ep:plus" />
        1
      </FaButton>
      <FaButton ml-2 @click="todoMinus">
        <FaIcon name="i-ep:minus" />
        1
      </FaButton>
    </div>
  </div>
</template>
