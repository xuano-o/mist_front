import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/stock_inquiry',
  component: Layout,
  redirect: '/stock_inquiry/stock_inquiry',
  name: 'stock_inquiry',
  meta: {
    title: $t('个股查询'),
    icon: 'stock_inquiry',
  },
  children: [
    {
      path: '',
      component: () => import('@/views/stock_inquiry/stock_inquiry.vue'),
      meta: {
        title: '个股查询',
        menu: false,
      },
    },
  ],
}

export default routes
