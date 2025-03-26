import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Form, Input, Select, InputNumber, Button, 
  Space, message 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCompetitorDetail, updateCompetitor } from '@/services/competitors';

const { Option } = Select;

const CompetitorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitorId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCompetitorDetails();
  }, [competitorId]);

  const fetchCompetitorDetails = async () => {
    try {
      setLoading(true);
      const response = await getCompetitorDetail(competitorId);
      if (response.success) {
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      message.error('获取选手信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await updateCompetitor(competitorId, values);
      if (response.success) {
        message.success('更新选手信息成功');
        history.push(`/competitors/${competitorId}`);
      } else {
        message.error('更新选手信息失败');
      }
    } catch (error) {
      message.error('更新选手信息失败');
    }
  };

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push(`/competitors/${competitorId}`)}
            type="link"
          />
          <span>编辑选手</span>
        </Space>
      }
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="englishName"
          label="英文名"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Select>
            <Option value="male">男</Option>
            <Option value="female">女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="city"
          label="城市"
          rules={[{ required: true, message: '请输入城市' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="crew"
          label="舞团"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={() => history.push(`/competitors/${competitorId}`)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CompetitorEdit; 