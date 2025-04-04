import React, { useState, useEffect } from 'react';
import { useParams } from '@umijs/max';
import {
  Card, Descriptions, Button, Space, message,
  Table, Tag, Row, Col, Statistic,
  Typography, Modal, Form, Select, InputNumber, Input
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {getBattleDetail, getBattleScores, createScore, updateBattle, getBattlesByStageId} from '@/services/battles';

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
  const { stageId } = useParams<{ id: string }>();
  let battleId = parseInt('0');

  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState<any>(null);
  const [competitors, setCompetitors] = useState([])
  const [scores, setScores] = useState<BattleScore[]>([]);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (stageId) {
      fetchBattleDetails();
      fetchScores();
    }
  }, [stageId]);

  const fetchBattleDetails = async () => {
    try {
      setLoading(true);
      const response = await getBattlesByStageId(stageId);
      console.log("=>(stageDetail.tsx:50) response", response);
      const competitorList = []
      // response是一个数组，每一个元素是一个对象，每个对象包含了competitor1和competitor2，我现在需要将所有的competitor1和competitor2合并到一个数组中并且去重
      for (let i = 0; i < response.length; i++) {
        const competitor1 = response[i].competitor1;
        const competitor2 = response[i].competitor2;
        if (competitor1) {
          competitorList.push(competitor1);
        }
        if (competitor2) {
          competitorList.push(competitor2);
        }
      }
      // 根据competitorList数组的每一个对象的id属性进行去重，保证每一个对象的id 属性不重复
      const uniqueCompetitors = competitorList.filter((competitor, index, self) =>
        index === self.findIndex((c) => c.id === competitor.id)
      );
      // TODO: 获取每个选手所有信息进行展示
      setCompetitors(uniqueCompetitors);
      battleId = response[1].id;
      const battleResponse = await getBattleDetail(battleId);
      console.log("=>(stageDetail.tsx:71) battleResponse", battleResponse);
      setBattle(battleResponse);
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
      // message.error('获取评分信息失败');
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
      title: '注册编号',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
    },
    {
      title: '艺名',
      dataIndex: 'bBoyName',
      key: 'bBoyName',
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '生日',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: '头像',
      dataIndex: 'photoUrl',
      key: 'photoUrl',
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
          <span>阶段详情</span>
        </Space>
      }
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
          {/*  展示一个阶段选手比赛排名的 Table*/}
            <Table
              columns={columns}
              dataSource={competitors}
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="下一阶段 - 对战列表">
            {/*TODO: 轮转(eg:1-16)进行对战组合展示*/}
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
