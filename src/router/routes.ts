import type { Route } from '#/global'
import type { RouteRecordRaw } from 'vue-router'
import { $t } from '@/locales'
import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:meta-layouts'
import AI from './modules/AI'
import HelpCenter from './modules/help_center.ts'
// import MultilevelMenuExample from './modules/multilevel.menu.example'
import MainPage from './modules/main_page.ts'
import MarketDynamics from './modules/market_dynamics'
import MarketIndex from './modules/market_index'
import StockInquiry from './modules/stock_inquiry'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      whiteList: true,
      title: $t('app.route.login'),
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        meta: {
          title: $t(useSettingsStore(pinia).settings.home.title),
          icon: 'i-ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: $t('app.route.reload'),
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '演示',
      icon: 'i-uim:box',
    },
    children: [
      // MultilevelMenuExample,
      MainPage,
      StockInquiry,
      MarketIndex,
      MarketDynamics,
      AI,
      HelpCenter,
    ],
  },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
}))

export {
  asyncRoutes,
  asyncRoutesByFilesystem,
  constantRoutes,
  constantRoutesByFilesystem,
  systemRoutes,
}
