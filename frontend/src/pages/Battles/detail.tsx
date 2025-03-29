import React, { useState, useEffect } from 'react';
import { useParams } from '@umijs/max';
import { 
  Card, Descriptions, Button, Space, message,
  Table, Tag, Row, Col, Statistic, 
  Typography, Modal, Form, Select, InputNumber, Input
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getBattleDetail, getBattleScores, createScore, updateBattle } from '@/services/battles';

const { Title } = Typography;
const { Option } = Select;

interface BattleScore {
  id: number;
  judgeId: number;
  judgeName: string;
  competitorId: number;
  competitorName: string;
  techniqueScore: number;
  originalityScore: number;
  musicalityScore: number;
  executionScore: number;
  comments: string;
  createdAt: string;
}

const BattleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const battleId = parseInt(id || '0');
  
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState<any>(null);
  const [scores, setScores] = useState<BattleScore[]>([]);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (battleId) {
      fetchBattleDetails();
      fetchScores();
    }
  }, [battleId]);

  const fetchBattleDetails = async () => {
    try {
      setLoading(true);
      const response = await getBattleDetail(battleId);
      console.log('Battle detail:', response);
      setBattle(response);
    } catch (error) {
      console.error('获取对战信息失败:', error);
      message.error('获取对战信息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await getBattleScores(battleId);
      console.log('Battle scores:', response);
      setScores(response || []);
    } catch (error) {
      console.error('获取评分信息失败:', error);
      message.error('获取评分信息失败');
    }
  };

  const handleSetWinner = async (competitorId: number) => {
    try {
      const response = await updateBattle({
        id: battleId,
        winnerId: competitorId,
        status: 'completed'
      });
      
      message.success('设置获胜者成功');
      fetchBattleDetails();
    } catch (error) {
      console.error('设置获胜者失败:', error);
      message.error('设置获胜者失败');
    }
  };

  const handleSubmitScore = async (values: any) => {
    try {
      const scoreData = {
        battleId,
        ...values
      };
      
      const response = await createScore(scoreData);
      message.success('提交评分成功');
      setScoreModalVisible(false);
      form.resetFields();
      fetchScores();
    } catch (error) {
      console.error('提交评分失败:', error);
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
      dataIndex: 'techniqueScore',
      key: 'techniqueScore',
    },
    {
      title: '原创性',
      dataIndex: 'originalityScore',
      key: 'originalityScore',
    },
    {
      title: '执行力',
      dataIndex: 'executionScore',
      key: 'executionScore',
    },
    {
      title: '音乐性',
      dataIndex: 'musicalityScore',
      key: 'musicalityScore',
    },
    {
      title: '评语',
      dataIndex: 'comments',
      key: 'comments',
      ellipsis: true,
    },
  ];

  if (!battle) {
    return <Card loading={loading}>加载中...</Card>;
  }

  // 处理状态显示
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Tag color="default">未开始</Tag>;
      case 'in_progress':
        return <Tag color="blue">进行中</Tag>;
      case 'completed':
        return <Tag color="green">已完成</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => window.location.href = '/battles'}
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
              <Descriptions.Item label="比赛">{battle.competition?.name || '未知比赛'}</Descriptions.Item>
              <Descriptions.Item label="阶段">{battle.stage?.name || '未知阶段'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(battle.status)}
              </Descriptions.Item>
              <Descriptions.Item label="顺序编号">{battle.battleOrder || '-'}</Descriptions.Item>
              <Descriptions.Item label="开始时间">{battle.startTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{battle.endTime || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="选手信息">
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Title level={4}>选手1</Title>
                  {battle.competitor1 ? (
                    <Descriptions column={1}>
                      <Descriptions.Item label="姓名">{battle.competitor1.realName}</Descriptions.Item>
                      <Descriptions.Item label="艺名">{battle.competitor1.bBoyName || '-'}</Descriptions.Item>
                      <Descriptions.Item label="性别">{
                        battle.competitor1.gender === 'male' ? '男' : 
                        battle.competitor1.gender === 'female' ? '女' : '其他'
                      }</Descriptions.Item>
                      <Descriptions.Item label="舞团">{battle.competitor1.team || '-'}</Descriptions.Item>
                      <Descriptions.Item label="国籍">{battle.competitor1.nationality || '-'}</Descriptions.Item>
                      {battle.winnerId === battle.competitor1.id && (
                        <Descriptions.Item label="状态">
                          <Tag color="gold">获胜者</Tag>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  ) : (
                    <div>未分配选手</div>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Title level={4}>选手2</Title>
                  {battle.competitor2 ? (
                    <Descriptions column={1}>
                      <Descriptions.Item label="姓名">{battle.competitor2.realName}</Descriptions.Item>
                      <Descriptions.Item label="艺名">{battle.competitor2.bBoyName || '-'}</Descriptions.Item>
                      <Descriptions.Item label="性别">{
                        battle.competitor2.gender === 'male' ? '男' : 
                        battle.competitor2.gender === 'female' ? '女' : '其他'
                      }</Descriptions.Item>
                      <Descriptions.Item label="舞团">{battle.competitor2.team || '-'}</Descriptions.Item>
                      <Descriptions.Item label="国籍">{battle.competitor2.nationality || '-'}</Descriptions.Item>
                      {battle.winnerId === battle.competitor2.id && (
                        <Descriptions.Item label="状态">
                          <Tag color="gold">获胜者</Tag>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  ) : (
                    <div>未分配选手</div>
                  )}
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
            {scores && scores.length > 0 ? (
              <Table 
                columns={columns} 
                dataSource={scores}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>暂无评分数据</div>
            )}
          </Card>
        </Col>

        {battle.status !== 'completed' && (
          <Col span={24}>
            <Card title="比赛结果">
              <Row gutter={16} align="middle">
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Space>
                    {battle.competitor1 && (
                      <Button 
                        type="primary" 
                        onClick={() => handleSetWinner(battle.competitor1.id)}
                      >
                        设置 {battle.competitor1.realName || battle.competitor1.bBoyName} 为获胜者
                      </Button>
                    )}
                    {battle.competitor2 && (
                      <Button 
                        type="primary" 
                        onClick={() => handleSetWinner(battle.competitor2.id)}
                      >
                        设置 {battle.competitor2.realName || battle.competitor2.bBoyName} 为获胜者
                      </Button>
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        )}

        {battle.status === 'completed' && battle.winnerId && (
          <Col span={24}>
            <Card title="比赛结果">
              <Row gutter={16} align="middle">
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="获胜者" 
                    value={
                      battle.winnerId === battle.competitor1?.id
                        ? (battle.competitor1?.realName || battle.competitor1?.bBoyName)
                        : (battle.competitor2?.realName || battle.competitor2?.bBoyName)
                    }
                    valueStyle={{ color: '#faad14', fontSize: '24px' }}
                  />
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
            name="judgeId"
            label="评委ID"
            rules={[{ required: true, message: '请输入评委ID' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>

          <Form.Item
            name="competitorId"
            label="选手"
            rules={[{ required: true, message: '请选择选手' }]}
          >
            <Select>
              {battle.competitor1 && (
                <Option value={battle.competitor1.id}>
                  {battle.competitor1.realName || battle.competitor1.bBoyName}
                </Option>
              )}
              {battle.competitor2 && (
                <Option value={battle.competitor2.id}>
                  {battle.competitor2.realName || battle.competitor2.bBoyName}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="techniqueScore"
            label="技术分"
            rules={[{ required: true, message: '请输入技术分' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="originalityScore"
            label="原创性"
            rules={[{ required: true, message: '请输入原创性分数' }]}
          >
            <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="executionScore"
            label="执行力"
            rules={[{ required: true, message: '请输入执行力分数' }]}
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
            name="comments"
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