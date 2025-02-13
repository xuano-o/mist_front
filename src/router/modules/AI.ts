import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/AI',
  component: Layout,
  redirect: '/AI/AI',
  name: 'AI',
  meta: {
    title: $t('AI助手'),
    icon: 'AI',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/AI/AI.vue'),
      meta: {
        title: 'AI助手',
        menu: false,
      },
    },
  ],
}

export default routes
