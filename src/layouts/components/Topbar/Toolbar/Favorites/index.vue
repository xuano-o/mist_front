<script setup lang="ts">
import Panel from './panel.vue'

defineOptions({
  name: 'Favorites',
})
</script>

<template>
  <FaPopover class="p-0">
    <FaButton variant="ghost" size="icon">
      <FaIcon name="i-uiw:star-off" class="size-4" />
    </FaButton>
    <template #panel>
      <Panel />
    </template>
  </FaPopover>
</template>
