<i18n lang="yaml">
zh-cn:
  title: 我的收藏夹
  add: 添加到收藏夹
  remove: 从收藏夹删除
  empty: 收藏夹是空的
  addToFavorites: 点击右上角
  addCurrentPage: 将当前页面添加到收藏夹
zh-tw:
  title: 我的收藏夾
  add: 添加到收藏夾
  remove: 從收藏夾刪除
  empty: 收藏夾是空的
  addToFavorites: 點擊右上角
  addCurrentPage: 將當前頁面添加到收藏夾
en:
  title: My Favorites
  add: Add to Favorites
  remove: Remove from Favorites
  empty: Favorites is empty
  addToFavorites: Click the upper right corner
  addCurrentPage: Add the current page to Favorites
</i18n>

<script setup lang="ts">
import useFavoritesStore from '@/store/modules/favorites'
import Sortable from 'sortablejs'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FavoritesPanel',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const { generateI18nTitle } = useMenu()

const favoritesContainerRef = useTemplateRef('favoritesContainerRef')

watch(() => favoritesContainerRef.value, (val) => {
  if (val) {
    // eslint-disable-next-line no-new
    new Sortable(val, {
      animation: 200,
      ghostClass: 'op-0',
      draggable: '.draggable-item',
      onUpdate: (e) => {
        if (e.newIndex !== undefined && e.oldIndex !== undefined) {
          favoritesStore.sort(e.newIndex, e.oldIndex)
        }
      },
    })
  }
})
</script>

<template>
  <div class="favorites-container w-80">
    <div class="flex items-center justify-between px-4 py-3">
      <div class="text-sm font-bold">
        {{ t('title') }}
      </div>
      <template v-if="favoritesStore.canAdd(route.fullPath)">
        <FaIcon v-if="!favoritesStore.isAdd(route.fullPath)" class="cursor-pointer text-xl" name="i-mdi:star-plus-outline" :title="t('add')" @click="favoritesStore.add(route)" />
        <FaIcon v-else class="cursor-pointer text-xl" name="i-mdi:star-remove" :title="t('remove')" @click="favoritesStore.remove(route.fullPath)" />
      </template>
    </div>
    <FaScrollArea class="max-h-220px">
      <div v-if="favoritesStore.list.length > 0" ref="favoritesContainerRef" class="flex flex-wrap items-center justify-between gap-2 px-4 pb-4">
        <div v-for="item in favoritesStore.list" :key="item.fullPath" :title="generateI18nTitle(item.title)" class="group draggable-item relative w-[calc(50%-0.25rem)] flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 ring-1 ring-border ring-inset hover-bg-accent" @click="router.push(item.fullPath)">
          <FaIcon v-if="item.icon" :name="item.icon" class="size-4" />
          <div class="flex-1 truncate pe-4 text-sm group-hover:[mask-image:linear-gradient(90deg,#000_calc(100%-80px),transparent)]">
            {{ generateI18nTitle(item.title) }}
          </div>
          <div class="absolute right-2 h-5 w-5 rounded-full text-secondary-foreground hidden group-hover:flex-center hover:(bg-secondary ring-1)">
            <FaIcon name="i-ep:delete" class="size-3" @click.stop="favoritesStore.remove(item.fullPath)" />
          </div>
        </div>
      </div>
      <div v-else class="flex-col-center py-6 text-secondary-foreground">
        <FaIcon name="i-tabler:mood-empty" class="size-10" />
        <p class="m-2 text-base">
          {{ t('empty') }}
        </p>
        <p v-show="favoritesStore.canAdd(route.fullPath)" class="m-0 flex-center text-sm op-75">
          {{ t('addToFavorites') }}
          <FaIcon name="i-mdi:star-plus-outline" class="mx-1 size-5 text-secondary-foreground" />
          {{ t('addCurrentPage') }}
        </p>
      </div>
    </FaScrollArea>
  </div>
</template>
