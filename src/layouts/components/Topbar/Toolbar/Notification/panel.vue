<script setup lang="ts">
import useNotificationStore from '@/store/modules/notification'
import All from './all.vue'

defineOptions({
  name: 'NotificationPanel',
})

const notificationStore = useNotificationStore()

const activeName = ref('message')

const showAll = ref(false)
</script>

<template>
  <div class="w-xs">
    <FaTabs
      v-model="activeName" :list="[
        {
          label: `消息 ${notificationStore.message > 0 ? `(${notificationStore.message})` : ''}`,
          value: 'message',
        },
        {
          label: `待办 ${notificationStore.todo > 0 ? `(${notificationStore.todo})` : ''}`,
          value: 'todo',
        },
      ]" class="m-3 mb-0"
    >
      <template #message>
        <FaScrollArea :scrollbar="false" mask class="max-h-300px">
          <div class="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-background-color hover-bg-muted">
            <div class="size-6 flex-center flex-shrink-0 rounded-full bg-blue">
              <FaIcon name="i-ri:mail-fill" class="size-4 text-white" />
            </div>
            <div class="flex-col-start gap-1">
              <div class="line-clamp-2 text-sm">
                你收到了 8 份日报
              </div>
              <div class="text-xs text-secondary-foreground/50">
                2020-10-10 10:00:00
              </div>
            </div>
          </div>
          <div class="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-background-color hover-bg-muted">
            <div class="size-6 flex-center flex-shrink-0 rounded-full bg-pink">
              <FaIcon name="i-ri:service-fill" class="size-4 text-white" />
            </div>
            <div class="flex-col-start gap-1">
              <div class="line-clamp-2 text-sm">
                你收到了 3 位同事的好友申请，请及时处理
              </div>
              <div class="text-xs text-secondary-foreground/50">
                2020-10-10 10:00:00
              </div>
            </div>
          </div>
          <div class="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-background-color hover-bg-muted">
            <div class="size-6 flex-center flex-shrink-0 rounded-full bg-orange">
              <FaIcon name="i-ri:file-edit-fill" class="size-4 text-white" />
            </div>
            <div class="flex-col-start gap-1">
              <div class="line-clamp-2 text-sm">
                你有 3 份合同待审批
              </div>
              <div class="text-xs text-secondary-foreground/50">
                2020-10-10 10:00:00
              </div>
            </div>
          </div>
          <div class="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-background-color hover-bg-muted">
            <div class="size-6 flex-center flex-shrink-0 rounded-full bg-blue">
              <FaIcon name="i-ri:mail-fill" class="size-4 text-white" />
            </div>
            <div class="flex-col-start gap-1">
              <div class="line-clamp-2 text-sm">
                你收到了 8 份日报
              </div>
              <div class="text-xs text-secondary-foreground/50">
                2020-10-10 10:00:00
              </div>
            </div>
          </div>
          <div class="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-background-color hover-bg-muted">
            <div class="size-6 flex-center flex-shrink-0 rounded-full bg-pink">
              <FaIcon name="i-ri:service-fill" class="size-4 text-white" />
            </div>
            <div class="flex-col-start gap-1">
              <div class="line-clamp-2 text-sm">
                你收到了 3 位同事的好友申请，请及时处理
              </div>
              <div class="text-xs text-secondary-foreground/50">
                2020-10-10 10:00:00
              </div>
            </div>
          </div>
        </FaScrollArea>
        <div class="cursor-pointer py-4 text-center text-sm text-secondary-foreground/50" @click="showAll = true">
          查看全部
        </div>
      </template>
      <template #todo>
        <FaScrollArea :scrollbar="false" mask class="max-h-300px">
          <div class="flex flex-col items-center py-6 text-secondary-foreground/50">
            <FaIcon name="i-tabler:mood-smile" class="size-10" />
            <p m-2 text-base>
              没有新待办
            </p>
          </div>
        </FaScrollArea>
      </template>
    </FaTabs>
    <FaModal v-model="showAll" title="通知中心" description="本页面仅模拟右上角通知数变化，具体业务逻辑请到 /src/layouts/components/Topbar/Toolbar/Notification/panel.vue 文件中编写" :footer="false">
      <All />
    </FaModal>
  </div>
</template>
