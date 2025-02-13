import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/market_dynamics',
  component: Layout,
  redirect: '/market_dynamics/market_dynamics',
  name: 'market_dynamics',
  meta: {
    title: $t('市场动态'),
    icon: 'market_dynamics',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/market_dynamics/market_dynamics.vue'),
      meta: {
        title: '市场动态',
        menu: false,
      },
    },
  ],
}

export default routes
