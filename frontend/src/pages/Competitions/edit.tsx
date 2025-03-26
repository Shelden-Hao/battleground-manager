import React, { useState, useEffect } from 'react';
import { history, useParams } from '@umijs/max';
import { 
  Card, Form, Input, DatePicker, InputNumber, Select, 
  Button, message, Space 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCompetitionDetail, updateCompetition } from '@/services/competitions';
import { parseDate } from '@/utils/utils';
import type { API } from '@/services/typings';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CompetitionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitionId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCompetitionDetails();
  }, [competitionId]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      const response = await getCompetitionDetail(competitionId);
      if (response.success) {
        const competition = response.data;
        form.setFieldsValue({
          ...competition,
          dateRange: [
            parseDate(competition.startDate),
            parseDate(competition.endDate),
          ],
          registrationDateRange: [
            parseDate(competition.registrationStartDate),
            parseDate(competition.registrationDeadline),
          ],
        });
      } else {
        message.error('获取比赛信息失败');
      }
    } catch (error) {
      message.error('获取比赛信息失败');
      console.error('获取比赛详情错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const [startDate, endDate] = values.dateRange;
      const [registrationStartDate, registrationEndDate] = values.registrationDateRange;
      
      const response = await updateCompetition(competitionId, {
        ...values,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        registrationStartDate: registrationStartDate.format('YYYY-MM-DD'),
        registrationDeadline: registrationEndDate.format('YYYY-MM-DD'),
      });

      if (response.success) {
        message.success('更新比赛信息成功');
        history.push(`/competitions/${competitionId}`);
      } else {
        message.error('更新比赛信息失败');
      }
    } catch (error) {
      message.error('更新比赛信息失败');
      console.error('更新比赛错误:', error);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push(`/competitions/${competitionId}`)}
            type="link"
          />
          <span>编辑比赛</span>
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
          label="比赛名称"
          rules={[{ required: true, message: '请输入比赛名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="比赛描述"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="比赛时间"
          rules={[{ required: true, message: '请选择比赛时间' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="location"
          label="比赛地点"
          rules={[{ required: true, message: '请输入比赛地点' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="maxParticipants"
          label="最大参赛人数"
          rules={[{ required: true, message: '请输入最大参赛人数' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="registrationDateRange"
          label="报名时间"
          rules={[{ required: true, message: '请选择报名时间' }]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="比赛状态"
          rules={[{ required: true, message: '请选择比赛状态' }]}
        >
          <Select>
            <Option value="draft">草稿</Option>
            <Option value="published">已发布</Option>
            <Option value="registration_closed">报名截止</Option>
            <Option value="in_progress">进行中</Option>
            <Option value="completed">已结束</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={() => history.push(`/competitions/${competitionId}`)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CompetitionEdit; 