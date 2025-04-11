import React, {useEffect, useState} from 'react';
import {history, useParams} from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import {ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, TrophyOutlined} from '@ant-design/icons';
import {
  createCompetitionStage,
  deleteCompetitionStage,
  getCompetitionDetail,
  getCompetitionStages
} from '@/services/competitions';
import {formatDate} from '@/utils/utils';
import type {API} from '@/services/typings';
import type {ColumnsType} from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const CompetitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitionId = parseInt(id);

  const [loading, setLoading] = useState(false);
  const [competition, setCompetition] = useState<API.Competition>();
  const [stages, setStages] = useState<API.CompetitionStage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState('basic');
  const [matchData, setMatchData] = useState<any[]>([]);
  const [top3Data, setTop3Data] = useState<any[]>([]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      const [competitionResponse, stagesResponse] = await Promise.all([
        getCompetitionDetail(competitionId),
        getCompetitionStages(competitionId),
      ]);
      console.log('Competition response:', competitionResponse);
      console.log('Stages response:', stagesResponse);

      if (competitionResponse.success) {
        setCompetition(competitionResponse.data);
      } else {
        message.error('获取比赛信息失败');
      }

      if (stagesResponse.success) {
        setStages(stagesResponse.data);
      } else {
        message.error('获取比赛阶段信息失败');
      }
    } catch (error) {
      message.error('获取比赛信息失败');
      console.error('获取比赛详情错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成假的对战数据
  const generateMatchData = () => {
    const mockMatches = [];
    const mockRankedMatch = ['1:16', '2:15', '3:14', '4:13', '5:12', '6:11', '7:10', '8:9'];
    // 创建mockRankedMatch的副本，用于随机选择并确保不重复
    const availableMatches = [...mockRankedMatch];
    
    for (let i = 1; i <= 8; i++) {
      // 随机选择一个可用的对战关系，然后从数组中移除它
      const randomIndex = Math.floor(Math.random() * availableMatches.length);
      const selectedMatch = availableMatches[randomIndex];
      // 从可用列表中移除已选择的对战关系
      availableMatches.splice(randomIndex, 1);
      
      mockMatches.push({
        id: i,
        matchNo: i,
        player1: {
          id: i * 2 - 1,
          name: `选手${i * 2 - 1}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 2 - 1}`,
          score: Math.floor(Math.random() * 100)
        },
        player2: {
          id: i * 2,
          name: `选手${i * 2}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 2}`,
          score: Math.floor(Math.random() * 100)
        },
        status: ['进行中', '已结束', '待开始'][Math.floor(Math.random() * 3)],
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * i).toISOString(),
        // 使用不重复的排名对拼
        location: selectedMatch
      });
    }
    setMatchData(mockMatches);
  };

  // 生成假的前三名数据
  const generateTop3Data = () => {
    const mockTop3 = [
      {
        rank: 1,
        name: '冠军选手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=winner',
        score: 98,
        matches: 5,
        wins: 5,
        details: '完美表现，所有比赛全胜'
      },
      {
        rank: 2,
        name: '亚军选手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=second',
        score: 90,
        matches: 5,
        wins: 4,
        details: '决赛失利，其他比赛表现出色'
      },
      {
        rank: 3,
        name: '季军选手',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=third',
        score: 85,
        matches: 5,
        wins: 3,
        details: '半决赛失利，季军争夺战胜出'
      }
    ];
    setTop3Data(mockTop3);
  };

  useEffect(() => {
    fetchCompetitionDetails();
    // 生成假数据
    generateMatchData();
    generateTop3Data();
  }, [competitionId]);

  const handleCreateStage = async (values: any) => {
    try {
      const [startDate, endDate] = values.dateRange;
      delete values.dateRange;

      const response = await createCompetitionStage(competitionId,{
        ...values,
        startDate,
        endDate,
      });

      if (response.success) {
        message.success('创建比赛阶段成功');
        setModalVisible(false);
        form.resetFields();
        fetchCompetitionDetails();
      } else {
        message.error('创建比赛阶段失败');
      }
    } catch (error) {
      message.error('创建比赛阶段失败');
      console.error('创建比赛阶段错误:', error);
    }
  };

  const handleDeleteStage = async (stageId: number) => {
    try {
      const response = await deleteCompetitionStage(competitionId, stageId);
      if (response.success) {
        message.success('删除比赛阶段成功');
        fetchCompetitionDetails();
      } else {
        message.error('删除比赛阶段失败');
      }
    } catch (error) {
      message.error('删除比赛阶段失败');
      console.error('删除比赛阶段错误:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'default',
      published: 'processing',
      registration_closed: 'warning',
      in_progress: 'success',
      completed: 'default',
      cancelled: 'error',
      pending: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      registration_closed: '报名截止',
      in_progress: '进行中',
      completed: '已结束',
      cancelled: '已取消',
      pending: '待开始',
    };
    return texts[status] || status;
  };

  const getStageTypeText = (type: string) => {
    const types: Record<string, string> = {
      qualification: '预选赛',
      top_16: '十六分之一决赛',
      top_8: '八分之一决赛',
      top_4: '四分之一决赛',
      final: '决赛',
    };
    return types[type] || type;
  };

  const stageColumns: ColumnsType<API.CompetitionStage> = [
    {
      title: '阶段名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '阶段类型',
      dataIndex: 'stageType',
      key: 'stageType',
      render: (type: string) => getStageTypeText(type),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => formatDate(text, 'yyyy-MM-dd'),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => formatDate(text, 'yyyy-MM-dd'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: API.CompetitionStage) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => history.push(`/competitions/${competitionId}/stages/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => history.push(`/competitions/${competitionId}/stages/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个阶段吗？"
            onConfirm={() => handleDeleteStage(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 对战列表的渲染组件
  const renderMatchList = () => {
    return (
      <div>
        <Row gutter={[16, 16]}>
          {matchData.map(match => (
            <Col xs={24} md={12} key={match.id}>
              <Card bordered hoverable>
                <Row align="middle" justify="space-between">
                  <Col span={10} style={{textAlign: 'center'}}>
                    <Avatar size={64} src={match.player1.avatar} />
                    <div style={{marginTop: 8}}>
                      <Text strong>{match.player1.name}</Text>
                    </div>
                    <div>
                      <Text type="danger" style={{fontSize: 20}}>{match.player1.score}</Text>
                    </div>
                  </Col>
                  <Col span={4} style={{textAlign: 'center'}}>
                    <Text strong style={{fontSize: 18}}>VS</Text>
                    <div>
                      <Badge 
                        status={match.status === '进行中' ? 'processing' : 
                               match.status === '已结束' ? 'success' : 'default'} 
                        text={match.status} 
                      />
                    </div>
                  </Col>
                  <Col span={10} style={{textAlign: 'center'}}>
                    <Avatar size={64} src={match.player2.avatar} />
                    <div style={{marginTop: 8}}>
                      <Text strong>{match.player2.name}</Text>
                    </div>
                    <div>
                      <Text type="danger" style={{fontSize: 20}}>{match.player2.score}</Text>
                    </div>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={12}>
                    <Text type="secondary">对战编号: {match.matchNo}</Text>
                  </Col>
                  <Col span={12} style={{textAlign: 'right'}}>
                    <Text type="secondary">排名对拼: {match.location }</Text>
                  </Col>
                </Row>
                <Row style={{marginTop: 8}}>
                  <Col span={24}>
                    <Text type="secondary">开始时间: {formatDate(match.startTime, 'yyyy-MM-dd HH:mm')}</Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 前三名成绩单的渲染组件
  const renderTop3 = () => {
    return (
      <div>
        <Row gutter={[16, 16]} justify="center">
          {top3Data.map(player => (
            <Col xs={24} sm={8} key={player.rank}>
              <Card 
                bordered 
                style={{
                  textAlign: 'center',
                  background: player.rank === 1 ? '#ffd70020' : 
                              player.rank === 2 ? '#c0c0c020' : 
                              '#cd7f3220'
                }}
              >
                <Badge count={<TrophyOutlined style={{
                  color: player.rank === 1 ? '#ffd700' : 
                         player.rank === 2 ? '#c0c0c0' : 
                         '#cd7f32'
                }} />}>
                  <Avatar 
                    size={100} 
                    src={player.avatar}
                    style={{
                      border: `3px solid ${
                        player.rank === 1 ? '#ffd700' : 
                        player.rank === 2 ? '#c0c0c0' : 
                        '#cd7f32'
                      }`
                    }}
                  />
                </Badge>
                <div style={{marginTop: 16}}>
                  <Title level={4}>{player.name}</Title>
                  <Tag color={
                    player.rank === 1 ? 'gold' : 
                    player.rank === 2 ? 'silver' : 
                    'orange'
                  }>
                    第{player.rank}名
                  </Tag>
                </div>
                <Descriptions column={1} style={{marginTop: 16}}>
                  <Descriptions.Item label="总分">{player.score}</Descriptions.Item>
                  <Descriptions.Item label="比赛场次">{player.matches}</Descriptions.Item>
                  <Descriptions.Item label="获胜场次">{player.wins}</Descriptions.Item>
                  <Descriptions.Item label="表现评价">{player.details}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  if (!competition) {
    return <Card loading={loading} />;
  }

  return (
    <div>
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => history.push('/competitions')}
              type="link"
            />
            <span>比赛详情</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => history.push(`/competitions/${competitionId}/edit`)}
          >
            编辑比赛
          </Button>
        }
        loading={loading}
      >
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="基本信息" key="basic">
            <Descriptions title="基本信息" bordered>
              <Descriptions.Item label="比赛名称" span={3}>{competition.name}</Descriptions.Item>
              <Descriptions.Item label="比赛描述" span={3}>{competition.description || '无'}</Descriptions.Item>
              <Descriptions.Item label="比赛时间" span={3}>
                {formatDate(competition.startDate, 'yyyy-MM-dd')} - {formatDate(competition.endDate, 'yyyy-MM-dd')}
              </Descriptions.Item>
              <Descriptions.Item label="比赛地点" span={3}>{competition.location || '无'}</Descriptions.Item>
              <Descriptions.Item label="最大参赛人数" span={1}>{competition.maxParticipants}</Descriptions.Item>
              <Descriptions.Item label="报名截止时间" span={1}>
                {formatDate(competition.registrationDeadline, 'yyyy-MM-dd')}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={1}>
                <Tag color={getStatusColor(competition.status)}>
                  {getStatusText(competition.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card
              title="比赛阶段"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  添加阶段
                </Button>
              }
              style={{ marginTop: 24 }}
            >
              <Table
                columns={stageColumns}
                dataSource={stages}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: '暂无比赛阶段' }}
              />
            </Card>
          </TabPane>
          
          <TabPane tab="对战列表" key="matches">
            <Card title="对战列表">
              {renderMatchList()}
            </Card>
          </TabPane>
          
          <TabPane tab="前三名成绩单" key="top3">
            <Card title="前三名成绩单">
              {renderTop3()}
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="添加比赛阶段"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateStage}
        >
          <Form.Item
            name="name"
            label="阶段名称"
            rules={[{ required: true, message: '请输入阶段名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="阶段描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="阶段类型"
            rules={[{ required: true, message: '请选择阶段类型' }]}
          >
            <Select>
              <Option value="qualification">预选赛</Option>
              <Option value="top_16">十六分之一决赛</Option>
              <Option value="sop_8">八分之一决赛</Option>
              <Option value="top_4">四分之一决赛</Option>
              <Option value="final">决赛</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="阶段时间"
            rules={[{ required: true, message: '请选择阶段时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="阶段状态"
            rules={[{ required: true, message: '请选择阶段状态' }]}
            initialValue="pending"
          >
            <Select>
              <Option value="pending">待开始</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompetitionDetail;
