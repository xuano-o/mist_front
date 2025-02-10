import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export default defineFakeRoute([
  {
    url: '/mock/app/route/list',
    method: 'get',
    response: () => {
      return {
        error: '',
        status: 1,
        data: [
          // 主导航
          {
            meta: {
              title: '演示',
              icon: 'uim:box',
            },
            children: [
              // 次导航（一级路由）
              {
                path: '/multilevel_menu_example',
                component: 'Layout',
                redirect: '/multilevel_menu_example/page',
                name: 'multilevelMenuExample',
                meta: {
                  title: '多级导航',
                  i18n: 'route.multimenu.root',
                  icon: 'heroicons-solid:menu-alt-3',
                },
                children: [
                  // 次导航（二级路由）
                  {
                    path: 'page',
                    name: 'multilevelMenuExample1',
                    component: 'multilevel_menu_example/page.vue',
                    meta: {
                      title: '导航1',
                      i18n: 'route.multimenu.page',
                    },
                  },
                  {
                    path: 'level2',
                    name: 'multilevelMenuExample2',
                    redirect: '/multilevel_menu_example/level2/page',
                    meta: {
                      title: '导航2',
                      i18n: 'route.multimenu.level2.root',
                    },
                    children: [
                      // 次导航（三级路由）
                      {
                        path: 'page',
                        name: 'multilevelMenuExample2-1',
                        component: 'multilevel_menu_example/level2/page.vue',
                        meta: {
                          title: '导航2-1',
                          i18n: 'route.multimenu.level2.page',
                        },
                      },
                      {
                        path: 'level3',
                        name: 'multilevelMenuExample2-2',
                        redirect: '/multilevel_menu_example/level2/level3/page1',
                        meta: {
                          title: '导航2-2',
                          i18n: 'route.multimenu.level2.level3.root',
                        },
                        children: [
                          // 次导航（四级路由）
                          {
                            path: 'page1',
                            name: 'multilevelMenuExample2-2-1',
                            component: 'multilevel_menu_example/level2/level3/page1.vue',
                            meta: {
                              title: '导航2-2-1',
                              i18n: 'route.multimenu.level2.level3.page1',
                            },
                          },
                          {
                            path: 'page2',
                            name: 'multilevelMenuExample2-2-2',
                            component: 'multilevel_menu_example/level2/level3/page2.vue',
                            meta: {
                              title: '导航2-2-2',
                              i18n: 'route.multimenu.level2.level3.page2',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/mock/app/menu/list',
    method: 'get',
    response: () => {
      return {
        error: '',
        status: 1,
        data: [
          {
            meta: {
              title: '演示',
              icon: 'uim:box',
            },
            children: [
              {
                meta: {
                  title: '多级导航',
                  icon: 'heroicons-solid:menu-alt-3',
                },
                children: [
                  {
                    path: '/multilevel_menu_example/page',
                    meta: {
                      title: '导航1',
                    },
                  },
                  {
                    meta: {
                      title: '导航2',
                    },
                    children: [
                      {
                        path: '/multilevel_menu_example/level2/page',
                        meta: {
                          title: '导航2-1',
                        },
                      },
                      {
                        meta: {
                          title: '导航2-2',
                        },
                        children: [
                          {
                            path: '/multilevel_menu_example/level2/level3/page1',
                            meta: {
                              title: '导航2-2-1',
                            },
                          },
                          {
                            path: '/multilevel_menu_example/level2/level3/page2',
                            meta: {
                              title: '导航2-2-2',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
])
