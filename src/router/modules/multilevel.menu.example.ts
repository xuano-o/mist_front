import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/multilevel_menu_example',
  component: Layout,
  redirect: '/multilevel_menu_example/page',
  name: 'multilevelMenuExample',
  meta: {
    title: $t('route.multimenu.root'),
    icon: 'i-heroicons-solid:menu-alt-3',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/multilevel_menu_example/page.vue'),
      meta: {
        title: '权限验证',
        menu: false,
      },
    },
  ],
}

export default routes
