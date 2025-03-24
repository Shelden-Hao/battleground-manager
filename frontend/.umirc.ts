import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '霹雳舞比赛管理系统',
    locale: false,
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
      ],
    },
    {
      name: '对阵管理',
      path: '/battles',
      routes: [
        {
          name: '对阵列表',
          path: '/battles',
          component: './Battles',
        },
        {
          name: '对阵详情',
          path: '/battles/:id',
          component: './BattleDetail',
          hideInMenu: true,
        },
        {
          name: '创建对阵',
          path: '/battles/create',
          component: './BattleForm',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '评分管理',
      path: '/scores',
      component: './Scores',
    },
    {
      name: '用户管理',
      path: '/users',
      component: './Users',
      access: 'isAdmin',
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
