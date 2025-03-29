import React, { useState, useEffect } from 'react';
import { useParams } from '@umijs/max';
import {
  Card, Form, Input, Select, DatePicker, Button,
  Space, message, Row, Col, Descriptions
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBattleDetail, updateBattle } from '@/services/battles';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BattleData {
  id: number;
  competitionId: number;
  stageId: number;
  competitor1Id?: number;
  competitor2Id?: number;
  battleOrder: number;
  winnerId?: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  startTime?: string;
  endTime?: string;
  competition?: {
    id: number;
    name: string;
  };
  stage?: {
    id: number;
    name: string;
  };
  competitor1?: {
    id: number;
    realName: string;
    bBoyName?: string;
  };
  competitor2?: {
    id: number;
    realName: string;
    bBoyName?: string;
  };
}

const BattleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const battleId = parseInt(id || '0');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [battle, setBattle] = useState<BattleData | null>(null);

  useEffect(() => {
    if (battleId) {
      fetchBattleDetail();
    }
  }, [battleId]);

  const fetchBattleDetail = async () => {
    try {
      setLoading(true);
      const response = await getBattleDetail(battleId);
      console.log('Battle detail:', response);
      setBattle(response);

      // 处理日期格式
      const formData = { ...response };
      if (formData.startTime && formData.endTime) {
        formData.timeRange = [
          moment(formData.startTime),
          moment(formData.endTime)
        ];
      }

      form.setFieldsValue(formData);
    } catch (error) {
      console.error('获取对战信息失败:', error);
      message.error('获取对战信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      console.log('Form values:', values);
      const battleDetail = await getBattleDetail(battleId);
      console.log("=>(edit.tsx:89) battleDetail", battleDetail);

      const [startTime, endTime] = values.timeRange || [];
      const data = {
        ...values,
        startTime: startTime?.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
        endTime: endTime?.format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
        winnerId: battleDetail.winnerId,
        competitor1Id: battleDetail.competitor1Id,
        competitor2Id: battleDetail.competitor2Id,
        stageId: battleDetail.stageId,
        competitionId: battleDetail.competitionId,
      };
      delete data.timeRange;
      delete data.competition;
      delete data.stage;
      delete data.competitor1;
      delete data.competitor2;

      console.log('Submitting data:', data);
      const response = await updateBattle({
        id: battleId,
        ...data
      });
      console.log('Update response:', response);

      message.success('更新成功');
      window.location.href = `/battles/${battleId}`;
    } catch (error) {
      console.error('更新失败:', error);
      message.error('更新失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (!battle) {
    return <Card loading={loading}>加载中...</Card>;
  }

  return (
    <Card
      title={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => window.location.href = `/battles/${battleId}`}
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
              <Descriptions.Item label="比赛">{battle.competition?.name || '未知比赛'}</Descriptions.Item>
              <Descriptions.Item label="阶段">{battle.stage?.name || '未知阶段'}</Descriptions.Item>
              <Descriptions.Item label="选手1">
                {battle.competitor1 ? (battle.competitor1.realName || battle.competitor1.bBoyName) : '未分配'}
              </Descriptions.Item>
              <Descriptions.Item label="选手2">
                {battle.competitor2 ? (battle.competitor2.realName || battle.competitor2.bBoyName) : '未分配'}
              </Descriptions.Item>
              <Descriptions.Item label="对战顺序">{battle.battleOrder || '-'}</Descriptions.Item>
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
                  <Option value="scheduled">未开始</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="battleOrder"
                label="对战顺序"
                rules={[{ required: true, message: '请输入对战顺序' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>

              <Form.Item
                name="timeRange"
                label="比赛时间"
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    保存
                  </Button>
                  <Button onClick={() => window.location.href = `/battles/${battleId}`}>
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
