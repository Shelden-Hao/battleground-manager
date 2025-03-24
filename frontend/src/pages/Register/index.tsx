import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { history } from '@umijs/max';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { register } from '@/services/auth';
import styles from './index.less';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      setLoading(true);
      await register(values);
      message.success('注册成功！即将跳转到登录页面...');
      setTimeout(() => {
        history.push('/login');
      }, 1500);
    } catch (error: any) {
      message.error(error.message || '注册失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="注册新账号" bordered={false}>
        <Form
          name="register"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度至少为6位！' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            已有账号？ <a href="/login">立即登录</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 