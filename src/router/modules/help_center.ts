import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/help_center',
  component: Layout,
  redirect: '/help_center/help_center',
  name: 'help_center',
  meta: {
    title: $t('帮助中心'),
    icon: 'help_center',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/help_center/help_center.vue'),
      meta: {
        title: '帮助中心',
        menu: false,
      },
    },
  ],
}

export default routes
