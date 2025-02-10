import { faker } from '@faker-js/faker'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/mock/user/login',
    method: 'post',
    response: ({ body }) => {
      return {
        error: '',
        status: 1,
        data: {
          account: body.account,
          token: `${body.account}:${faker.internet.jwt()}`,
          avatar: 'https://fantastic-admin.hurui.me/logo.svg',
        },
      }
    },
  },
  {
    url: '/mock/user/login/expired',
    method: 'post',
    response: () => {
      return {
        error: '',
        status: 0,
      }
    },
  },
  {
    url: '/mock/user/permission',
    method: 'get',
    response: ({ headers }) => {
      let permissions: string[] = []
      if (headers.token?.indexOf('admin') === 0) {
        permissions = [
          'permission.browse',
          'permission.create',
          'permission.edit',
          'permission.remove',
        ]
      }
      else if (headers.token?.indexOf('test') === 0) {
        permissions = [
          'permission.browse',
        ]
      }
      return {
        error: '',
        status: 1,
        data: {
          permissions,
        },
      }
    },
  },
  {
    url: '/mock/user/password/edit',
    method: 'post',
    response: () => {
      return {
        error: '',
        status: 1,
        data: {
          isSuccess: true,
        },
      }
    },
  },
  {
    url: '/mock/user/preferences',
    method: 'get',
    response: ({ headers }) => {
      let preferences = ''
      if (headers.token?.indexOf('admin') === 0) {
        preferences = '{"app":{"colorScheme":"light"}}'
      }
      else if (headers.token?.indexOf('test') === 0) {
        preferences = '{"app":{"colorScheme":"dark","raduis":1},"menu":{"mode":"head","style":""},"layout":{"widthMode":"center"},"tabbar":{"enable":false}}'
      }
      return {
        error: '',
        status: 1,
        data: {
          preferences,
        },
      }
    },
  },
  {
    url: '/mock/user/preferences/edit',
    method: 'post',
    response: () => {
      return {
        error: '',
        status: 1,
        data: {
          isSuccess: true,
        },
      }
    },
  },
  {
    url: '/mock/user/tabbar',
    method: 'get',
    response: ({ headers }) => {
      let tabbar = ''
      if (headers.token?.indexOf('admin') === 0) {
        tabbar = ''
      }
      return {
        error: '',
        status: 1,
        data: {
          tabbar,
        },
      }
    },
  },
  {
    url: '/mock/user/tabbar/edit',
    method: 'post',
    response: () => {
      return {
        error: '',
        status: 1,
        data: {
          isSuccess: true,
        },
      }
    },
  },
  {
    url: '/mock/user/favorites',
    method: 'get',
    response: ({ headers }) => {
      let favorites = ''
      if (headers.token?.indexOf('admin') === 0) {
        favorites = '[{"fullPath":"/multilevel_menu_example/page","title":"导航1","i18n":"route.multimenu.page","icon":"heroicons-solid:menu-alt-3"}]'
      }
      return {
        error: '',
        status: 1,
        data: {
          favorites,
        },
      }
    },
  },
  {
    url: '/mock/user/favorites/edit',
    method: 'post',
    response: () => {
      return {
        error: '',
        status: 1,
        data: {
          isSuccess: true,
        },
      }
    },
  },
])
