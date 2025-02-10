<script setup lang="ts">
import LoginAgainForm from '@/components/AccountForm/LoginAgainForm.vue'
import eventBus from '@/utils/eventBus'

const isShow = ref(false)

onMounted(() => {
  eventBus.on('global-login-again-visible', () => {
    isShow.value = true
  })
})

async function handleAfterLogin() {
  isShow.value = false
}
</script>

<template>
  <FaModal v-model="isShow" :header="false" :footer="false" :closable="false" :close-on-click-overlay="false" :close-on-press-escape="false">
    <LoginAgainForm @on-after-login="handleAfterLogin" />
  </FaModal>
</template>
