import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Form, Input, Select, DatePicker, Button, 
  Space, message, Row, Col, Descriptions
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBattleDetail, updateBattle } from '@/services/battles';
import type { API } from '@/services/typings';

const { Option } = Select;
const { RangePicker } = DatePicker;

const BattleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const battleId = parseInt(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState<API.Battle | null>(null);

  useEffect(() => {
    fetchBattleDetail();
  }, [battleId]);

  const fetchBattleDetail = async () => {
    try {
      setLoading(true);
      const response = await getBattleDetail(battleId);
      if (response.success) {
        setBattle(response.data);
        form.setFieldsValue({
          ...response.data,
          timeRange: response.data.startTime && response.data.endTime ? [
            new Date(response.data.startTime),
            new Date(response.data.endTime)
          ] : undefined,
        });
      }
    } catch (error) {
      message.error('获取对战信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const [startTime, endTime] = values.timeRange || [];
      const data = {
        ...values,
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
      };
      delete data.timeRange;

      const response = await updateBattle(battleId, data);
      if (response.success) {
        message.success('更新成功');
        history.push(`/battles/${battleId}`);
      } else {
        message.error('更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  if (!battle) {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push(`/battles/${battleId}`)}
            type="link"
          />
          <span>编辑对战</span>
        </Space>
      }
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions title="基本信息" bordered>
              <Descriptions.Item label="比赛">{battle.competition?.name}</Descriptions.Item>
              <Descriptions.Item label="阶段">{battle.stage?.name}</Descriptions.Item>
              <Descriptions.Item label="选手1">{battle.competitor1?.name}</Descriptions.Item>
              <Descriptions.Item label="选手2">{battle.competitor2?.name}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="pending">未开始</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="timeRange"
                label="比赛时间"
                rules={[{ required: true, message: '请选择比赛时间' }]}
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                  <Button onClick={() => history.push(`/battles/${battleId}`)}>
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BattleEdit; 