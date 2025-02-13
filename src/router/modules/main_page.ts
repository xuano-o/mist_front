import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/main_page',
  component: Layout,
  redirect: '/main_page/main_page',
  name: 'main_page',
  meta: {
    title: $t('首页'),
    icon: 'main_page',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/main_page/main_page.vue'),
      meta: {
        title: '首页',
        menu: false,
      },
    },
  ],
}

export default routes
