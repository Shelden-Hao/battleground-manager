import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from '@umijs/max';
import styles from './index.less';
import { login } from '@/services/auth';

const LoginPage: React.FC = () => {
  const [loginError, setLoginError] = useState<string>('');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    
    if (userInfo) {
      await setInitialState((state) => ({
        ...state,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const result = await login(values);
      
      if (result) {
        message.success('登录成功');
        localStorage.setItem('token', result.access_token);
        
        await fetchUserInfo();
        history.push('/dashboard');
        return;
      }
    } catch (error: any) {
      setLoginError(error.response?.data?.message || '登录失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="霹雳舞比赛管理系统"
          subTitle="Breaking Dance Competition Management System"
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {loginError && (
            <Alert
              style={{ marginBottom: 24 }}
              message={loginError}
              type="error"
              showIcon
            />
          )}

          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />

          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />

          <div style={{ marginBottom: 24 }}>
            <a href="/register">注册新账号</a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default LoginPage; 