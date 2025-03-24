import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Row, Col, Descriptions, Button, Table, Tag, message, 
  Statistic, Divider, Space, Typography, Empty, Progress, Tabs, Modal, Form, Select, InputNumber, Input 
} from 'antd';
import {
  ArrowLeftOutlined, TrophyOutlined, EditOutlined, 
  FieldTimeOutlined, ScoreboardOutlined, UserOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { getBattleDetail, getBattleScores, createScore, updateBattle } from '@/services/battles';
import { formatDate, formatScore, getScoreColor } from '@/utils/utils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const BattleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const battleId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [battle, setBattle] = useState<any>(null);
  const [scoresData, setScoresData] = useState<any[]>([]);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [currentCompetitor, setCurrentCompetitor] = useState<any>(null);
  const [form] = Form.useForm();
  
  // 判断当前用户是否有评委权限（实际项目中应该从权限系统获取）
  const hasJudgeAccess = true; // 模拟评委权限
  const hasAdminAccess = true; // 模拟管理员权限
  
  useEffect(() => {
    fetchBattleDetails();
  }, [battleId]);
  
  const fetchBattleDetails = async () => {
    try {
      setLoading(true);
      const battleResponse = await getBattleDetail(battleId);
      if (battleResponse.success) {
        setBattle(battleResponse.data);
      }
      
      const scoresResponse = await getBattleScores(battleId);
      if (scoresResponse.success && scoresResponse.data?.scores) {
        setScoresData(scoresResponse.data.scores || []);
      }
      
      setLoading(false);
    } catch (error) {
      message.error('获取对阵详情失败');
      setLoading(false);
    }
  };
  
  const handleSetWinner = async (competitorId: number) => {
    try {
      if (!battle) return;
      const response = await updateBattle(battleId, { 
        winnerId: competitorId,
        status: 'completed'
      });
      
      if (response.success) {
        message.success('设置获胜者成功');
        fetchBattleDetails();
      } else {
        message.error('设置获胜者失败');
      }
    } catch (error) {
      message.error('设置获胜者失败');
    }
  };
  
  const showScoreModal = (competitor: any) => {
    setCurrentCompetitor(competitor);
    setScoreModalVisible(true);
    form.resetFields();
  };
  
  const handleScoreSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await createScore({
        battleId,
        competitorId: currentCompetitor.competitor.id,
        judgeId: values.judgeId,
        techniqueScore: values.techniqueScore,
        originalityScore: values.originalityScore,
        musicalityScore: values.musicalityScore,
        executionScore: values.executionScore,
        comments: values.comments
      });
      
      if (response.success) {
        message.success('评分提交成功');
        setScoreModalVisible(false);
        fetchBattleDetails();
      } else {
        message.error('评分提交失败');
      }
    } catch (error) {
      message.error('评分提交失败');
    }
  };
  
  const renderBattleStatus = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'blue', text: '待进行' },
      inProgress: { color: 'orange', text: '进行中' },
      completed: { color: 'green', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };
  
  const renderCompetitorScoresSummary = (competitorScores: any) => {
    if (!competitorScores) return null;
    
    const { competitor, averages } = competitorScores;
    
    return (
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>{competitor.bBoyName || competitor.realName}</span>
            {battle?.winnerId === competitor.id && (
              <Tag color="gold" icon={<TrophyOutlined />}>获胜者</Tag>
            )}
          </Space>
        }
        className={styles.scoreCard}
        extra={
          hasJudgeAccess && (
            <Button type="primary" onClick={() => showScoreModal(competitorScores)}>
              评分
            </Button>
          )
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Statistic 
              title="技术分" 
              value={averages.technique} 
              precision={2} 
              valueStyle={{ color: getScoreColor(averages.technique) }}
            />
            <Progress 
              percent={averages.technique * 10} 
              size="small" 
              strokeColor={getScoreColor(averages.technique)}
              showInfo={false}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="原创性" 
              value={averages.originality} 
              precision={2}
              valueStyle={{ color: getScoreColor(averages.originality) }}
            />
            <Progress 
              percent={averages.originality * 10} 
              size="small" 
              strokeColor={getScoreColor(averages.originality)}
              showInfo={false}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="音乐性" 
              value={averages.musicality} 
              precision={2}
              valueStyle={{ color: getScoreColor(averages.musicality) }}
            />
            <Progress 
              percent={averages.musicality * 10} 
              size="small" 
              strokeColor={getScoreColor(averages.musicality)}
              showInfo={false}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="表现力" 
              value={averages.execution} 
              precision={2}
              valueStyle={{ color: getScoreColor(averages.execution) }}
            />
            <Progress 
              percent={averages.execution * 10} 
              size="small" 
              strokeColor={getScoreColor(averages.execution)}
              showInfo={false}
            />
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Row>
          <Col span={24}>
            <Statistic 
              title="总分" 
              value={averages.total} 
              precision={2}
              valueStyle={{ color: getScoreColor(averages.total), fontSize: '24px' }}
            />
            <Progress 
              percent={averages.total * 10} 
              strokeColor={getScoreColor(averages.total)}
            />
          </Col>
        </Row>
        
        <Divider orientation="left">评委评分详情</Divider>
        <Table 
          dataSource={competitorScores.judgeScores}
          rowKey={(record) => `${record.judge.id}`}
          pagination={false}
          size="small"
          columns={[
            {
              title: '评委',
              dataIndex: ['judge', 'name'],
              key: 'judgeName',
              width: 120,
            },
            {
              title: '技术',
              dataIndex: 'techniqueScore',
              key: 'techniqueScore',
              width: 80,
              render: (score) => formatScore(score),
            },
            {
              title: '原创',
              dataIndex: 'originalityScore',
              key: 'originalityScore',
              width: 80,
              render: (score) => formatScore(score),
            },
            {
              title: '音乐性',
              dataIndex: 'musicalityScore',
              key: 'musicalityScore',
              width: 80,
              render: (score) => formatScore(score),
            },
            {
              title: '表现',
              dataIndex: 'executionScore',
              key: 'executionScore',
              width: 80,
              render: (score) => formatScore(score),
            },
            {
              title: '备注',
              dataIndex: 'comments',
              key: 'comments',
              ellipsis: true,
            },
          ]}
        />
      </Card>
    );
  };
  
  if (!battle) {
    return (
      <Card loading={loading}>
        <Empty description="无法获取对阵信息" />
      </Card>
    );
  }
  
  return (
    <div className={styles.container}>
      <Card
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => history.push('/battles')}
              type="link"
            />
            <Title level={4} style={{ margin: 0 }}>
              对阵详情 #{battle.id}
            </Title>
            {renderBattleStatus(battle.status)}
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => history.push(`/battles/edit/${battle.id}`)}
            >
              编辑对阵
            </Button>
          </Space>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Descriptions bordered size="small" column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="比赛">
                {battle.competition?.name || `比赛ID: ${battle.competitionId}`}
              </Descriptions.Item>
              <Descriptions.Item label="比赛阶段">
                {battle.stage?.name || `阶段ID: ${battle.stageId}`}
              </Descriptions.Item>
              <Descriptions.Item label="对阵顺序">
                {battle.battleOrder}
              </Descriptions.Item>
              <Descriptions.Item label="对阵状态">
                {renderBattleStatus(battle.status)}
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {battle.startTime ? formatDate(battle.startTime) : '未开始'}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {battle.endTime ? formatDate(battle.endTime) : '未结束'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          
          <Col span={24}>
            <Card 
              title={<Space><TrophyOutlined /> <span>对阵选手</span></Space>} 
              bordered={false}
              className={styles.matchupCard}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>
                  <Card className={styles.competitorCard}>
                    {battle.competitor1 ? (
                      <div className={styles.competitorInfo}>
                        <div className={styles.competitorAvatar}>
                          {battle.competitor1.bBoyName?.charAt(0) || battle.competitor1.realName?.charAt(0) || ''}
                        </div>
                        <div className={styles.competitorName}>
                          <Text strong>{battle.competitor1.bBoyName || battle.competitor1.realName}</Text>
                          {battle.competitor1.bBoyName && <Text type="secondary">{battle.competitor1.realName}</Text>}
                        </div>
                        {battle.winnerId === battle.competitor1.id && (
                          <Tag color="gold" icon={<TrophyOutlined />}>获胜者</Tag>
                        )}
                        {hasAdminAccess && battle.status === 'inProgress' && (
                          <Button 
                            type="primary" 
                            onClick={() => handleSetWinner(battle.competitor1!.id)}
                            size="small"
                            style={{ marginTop: 8 }}
                          >
                            设为获胜者
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Empty description="未分配选手" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Card>
                </Col>
                <Col span={4} className={styles.vsColumn}>
                  <div className={styles.vsText}>VS</div>
                </Col>
                <Col span={10}>
                  <Card className={styles.competitorCard}>
                    {battle.competitor2 ? (
                      <div className={styles.competitorInfo}>
                        <div className={styles.competitorAvatar}>
                          {battle.competitor2.bBoyName?.charAt(0) || battle.competitor2.realName?.charAt(0) || ''}
                        </div>
                        <div className={styles.competitorName}>
                          <Text strong>{battle.competitor2.bBoyName || battle.competitor2.realName}</Text>
                          {battle.competitor2.bBoyName && <Text type="secondary">{battle.competitor2.realName}</Text>}
                        </div>
                        {battle.winnerId === battle.competitor2.id && (
                          <Tag color="gold" icon={<TrophyOutlined />}>获胜者</Tag>
                        )}
                        {hasAdminAccess && battle.status === 'inProgress' && (
                          <Button 
                            type="primary" 
                            onClick={() => handleSetWinner(battle.competitor2!.id)}
                            size="small"
                            style={{ marginTop: 8 }}
                          >
                            设为获胜者
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Empty description="未分配选手" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card 
              title={<Space><ScoreboardOutlined /> <span>评分详情</span></Space>} 
              bordered={false}
            >
              {scoresData.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {scoresData.map((competitorScores: any) => (
                    <Col span={24} key={competitorScores.competitor.id}>
                      {renderCompetitorScoresSummary(competitorScores)}
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="暂无评分数据" />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
      
      <Modal
        title="提交评分"
        visible={scoreModalVisible}
        onCancel={() => setScoreModalVisible(false)}
        onOk={handleScoreSubmit}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="judgeId"
            label="评委"
            rules={[{ required: true, message: '请选择评委' }]}
          >
            <Select placeholder="选择评委">
              {/* 在实际项目中，应该从API获取评委列表 */}
              <Option value={1}>张三</Option>
              <Option value={2}>李四</Option>
              <Option value={3}>王五</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="techniqueScore"
            label="技术分 (1-10)"
            rules={[{ required: true, message: '请输入技术分' }]}
          >
            <InputNumber min={1} max={10} step={0.1} precision={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="originalityScore"
            label="原创性 (1-10)"
            rules={[{ required: true, message: '请输入原创性分数' }]}
          >
            <InputNumber min={1} max={10} step={0.1} precision={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="musicalityScore"
            label="音乐性 (1-10)"
            rules={[{ required: true, message: '请输入音乐性分数' }]}
          >
            <InputNumber min={1} max={10} step={0.1} precision={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="executionScore"
            label="表现力 (1-10)"
            rules={[{ required: true, message: '请输入表现力分数' }]}
          >
            <InputNumber min={1} max={10} step={0.1} precision={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="comments"
            label="评价备注"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BattleDetail; 