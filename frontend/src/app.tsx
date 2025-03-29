import { RunTimeLayoutConfig } from '@umijs/max';
import { history, RequestConfig } from 'umi';
import { getCurrentUser } from './services/auth';
import { message } from 'antd';

// 获取用户信息
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return undefined;
      }
      const currentUser = await getCurrentUser();
      return currentUser;
    } catch (error) {
      history.push('/login');
      return undefined;
    }
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== '/login' && location.pathname !== '/register') {
    const currentUser = await fetchUserInfo();
    return {
      currentUser,
      fetchUserInfo,
    };
  }
  return {
    fetchUserInfo,
  };
}

// 布局配置
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://img.ixintu.com/download/jpg/20200909/a27a8cb1fb9d6dbaf2bbaff07b6e4800_512_512.jpg!bg',
    menu: {
      locale: false,
    },
    rightContentRender: () => <div></div>,
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: initialState?.currentUser?.name || initialState?.currentUser?.username,
      render: (_, avatarChildren) => {
        return <div>{avatarChildren}</div>;
      },
    },
    footerRender: () => <div style={{ textAlign: 'center', padding: '20px' }}>霹雳舞比赛管理系统 ©2023</div>,
  };
};

// 请求配置
export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    adaptor: (resData: any) => {
      return {
        ...resData,
        success: resData.success,
        errorMessage: resData.message,
      };
    },
  },
  requestInterceptors: [
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response) => {
      return response;
    },
  ],
};
