import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/market_index',
  component: Layout,
  redirect: '/market_index/market_index',
  name: 'market_index',
  meta: {
    title: $t('市场指数'),
    icon: 'market_index',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/market_index/market_index.vue'),
      meta: {
        title: '市场指数',
        menu: false,
      },
    },
  ],
}

export default routes
