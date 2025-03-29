import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Form, Input, Select, DatePicker, Button, 
  Space, message, Upload 
} from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { getCompetitorDetail, updateCompetitor } from '@/services/competitors';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const CompetitorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitorId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCompetitorDetails();
  }, [competitorId]);

  const fetchCompetitorDetails = async () => {
    try {
      setLoading(true);
      const response = await getCompetitorDetail(competitorId);
      console.log('Fetched competitor data:', response);
      
      // 处理日期
      const formData = { ...response };
      if (formData.birthDate) {
        formData.birthDate = moment(formData.birthDate);
      }
      
      form.setFieldsValue(formData);
    } catch (error) {
      console.error('获取选手信息失败:', error);
      message.error('获取选手信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      console.log('Form values to submit:', values);
      
      // 处理日期格式
      const submitData = { ...values };
      if (submitData.birthDate) {
        submitData.birthDate = submitData.birthDate.format('YYYY-MM-DD');
      }
      
      const response = await updateCompetitor(competitorId, submitData);
      console.log('Update response:', response);
      
      message.success('更新选手信息成功');
      history.push(`/competitors/${competitorId}`);
    } catch (error) {
      console.error('更新选手信息失败:', error);
      message.error('更新选手信息失败');
    } finally {
      setSubmitting(false);
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
        initialValues={{
          gender: 'male',
          status: 'registered',
        }}
      >
        <Form.Item
          name="realName"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="bBoyName"
          label="艺名"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="registrationNumber"
          label="注册编号"
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
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="出生日期"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="nationality"
          label="国籍"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="team"
          label="舞团"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
        >
          <Select>
            <Option value="registered">已注册</Option>
            <Option value="qualified">已晋级</Option>
            <Option value="eliminated">已淘汰</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="photoUrl"
          label="头像URL"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
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