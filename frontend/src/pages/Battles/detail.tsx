import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Descriptions, Button, Space, message,
  Table, Tag, Row, Col, Statistic, Divider,
  Typography, Empty, Progress, Tabs, Modal,
  Form, Select, InputNumber, Input
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBattleDetail, getBattleScores, createScore } from '@/services/battles';

const { Title, Text } = Typography;
const { Option } = Select;

const BattleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const battleId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBattleDetails();
    fetchScores();
  }, [battleId]);

  const fetchBattleDetails = async () => {
    try {
      setLoading(true);
      const response = await getBattleDetail(battleId);
      if (response.success) {
        setBattle(response.data);
      }
    } catch (error) {
      message.error('获取对战信息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await getBattleScores(battleId);
      if (response.success) {
        setScores(response.data);
      }
    } catch (error) {
      message.error('获取评分信息失败');
    }
  };

  const handleSetWinner = async (competitorId: number) => {
    try {
      // TODO: 实现设置获胜者的API
      message.success('设置获胜者成功');
      fetchBattleDetails();
    } catch (error) {
      message.error('设置获胜者失败');
    }
  };

  const handleSubmitScore = async (values: any) => {
    try {
      const response = await createScore(battleId, values);
      if (response.success) {
        message.success('提交评分成功');
        setScoreModalVisible(false);
        form.resetFields();
        fetchScores();
      } else {
        message.error('提交评分失败');
      }
    } catch (error) {
      message.error('提交评分失败');
    }
  };

  const columns = [
    {
      title: '评委',
      dataIndex: 'judgeName',
      key: 'judgeName',
    },
    {
      title: '选手',
      dataIndex: 'competitorName',
      key: 'competitorName',
    },
    {
      title: '技术分',
      dataIndex: 'technicalScore',
      key: 'technicalScore',
    },
    {
      title: '创意分',
      dataIndex: 'creativeScore',
      key: 'creativeScore',
    },
    {
      title: '表现力',
      dataIndex: 'performanceScore',
      key: 'performanceScore',
    },
    {
      title: '音乐性',
      dataIndex: 'musicalityScore',
      key: 'musicalityScore',
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
    },
    {
      title: '评语',
      dataIndex: 'comment',
      key: 'comment',
    },
  ];

  if (!battle) {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push('/battles')}
            type="link"
          />
          <span>对战详情</span>
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
              <Descriptions.Item label="状态">
                <Tag color={
                  battle.status === 'completed' ? 'green' :
                  battle.status === 'in_progress' ? 'blue' : 'default'
                }>
                  {battle.status === 'completed' ? '已完成' :
                   battle.status === 'in_progress' ? '进行中' : '未开始'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">{battle.startTime}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{battle.endTime}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="选手信息">
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Title level={4}>{battle.competitor1?.name}</Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="英文名">{battle.competitor1?.englishName}</Descriptions.Item>
                    <Descriptions.Item label="城市">{battle.competitor1?.city}</Descriptions.Item>
                    <Descriptions.Item label="舞团">{battle.competitor1?.crew}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Title level={4}>{battle.competitor2?.name}</Title>
                  <Descriptions column={1}>
                    <Descriptions.Item label="英文名">{battle.competitor2?.englishName}</Descriptions.Item>
                    <Descriptions.Item label="城市">{battle.competitor2?.city}</Descriptions.Item>
                    <Descriptions.Item label="舞团">{battle.competitor2?.crew}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title="评分信息"
            extra={
              <Button type="primary" onClick={() => setScoreModalVisible(true)}>
                提交评分
              </Button>
            }
          >
            <Table 
              columns={columns} 
              dataSource={scores}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>

        {battle.status === 'completed' && (
          <Col span={24}>
            <Card title="比赛结果">
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Statistic 
                    title="获胜者" 
                    value={battle.winner?.name || '未设置'} 
                  />
                </Col>
                <Col span={12}>
                  <Space>
                    <Button 
                      type="primary" 
                      onClick={() => handleSetWinner(battle.competitor1?.id)}
                    >
                      设置 {battle.competitor1?.name} 为获胜者
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={() => handleSetWinner(battle.competitor2?.id)}
                    >
                      设置 {battle.competitor2?.name} 为获胜者
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        title="提交评分"
        open={scoreModalVisible}
        onCancel={() => setScoreModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitScore}
        >
          <Form.Item
            name="competitorId"
            label="选手"
            rules={[{ required: true, message: '请选择选手' }]}
          >
            <Select>
              <Option value={battle.competitor1?.id}>{battle.competitor1?.name}</Option>
              <Option value={battle.competitor2?.id}>{battle.competitor2?.name}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="technicalScore"
            label="技术分"
            rules={[{ required: true, message: '请输入技术分' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="creativeScore"
            label="创意分"
            rules={[{ required: true, message: '请输入创意分' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="performanceScore"
            label="表现力"
            rules={[{ required: true, message: '请输入表现力分数' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="musicalityScore"
            label="音乐性"
            rules={[{ required: true, message: '请输入音乐性分数' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label="评语"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => setScoreModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BattleDetail; 