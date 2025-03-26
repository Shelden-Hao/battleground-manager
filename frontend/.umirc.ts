import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data',
  },
  layout: {
    title: '霹雳舞比赛管理系统',
    locale: false,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: '登录',
      path: '/login',
      layout: false,
      component: './Login',
    },
    {
      name: '注册',
      path: '/register',
      layout: false,
      component: './Register',
    },
    {
      name: '首页',
      path: '/dashboard',
      component: './Dashboard',
    },
    {
      name: '比赛管理',
      path: '/competitions',
      routes: [
        {
          name: '比赛列表',
          path: '/competitions',
          component: './Competitions',
        },
        {
          path: '/competitions/:id',
          component: './Competitions/detail',
          hideInMenu: true,
          exact: true,
        },
        {
          path: '/competitions/:id/edit',
          component: './Competitions/edit',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '选手管理',
      path: '/competitors',
      routes: [
        {
          name: '选手列表',
          path: '/competitors',
          component: './Competitors',
        },
        {
          path: '/competitors/:id',
          component: './Competitors/detail',
          hideInMenu: true,
          exact: true,
        },
        {
          path: '/competitors/:id/edit',
          component: './Competitors/edit',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '对战管理',
      path: '/battles',
      routes: [
        {
          name: '对战列表',
          path: '/battles',
          component: './Battles',
        },
        {
          path: '/battles/:id',
          component: './Battles/detail',
          hideInMenu: true,
          exact: true,
        },
        {
          path: '/battles/:id/edit',
          component: './Battles/edit',
          hideInMenu: true,
        },
      ],
    },
  ],
  npmClient: 'npm',
});
