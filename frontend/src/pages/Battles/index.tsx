import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, message, Tag, Space, Select, Popconfirm, Tooltip, Modal, Form, DatePicker, Row, Col, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import {
  getBattlesList,
  deleteBattle,
  createBattle,
  getBattlesByCompetitionId,
  getBattlesByStageId
} from '@/services/battles';
import {CompetitionListParams, getCompetitionsList} from '@/services/competitions';
import { getCompetitionStages } from '@/services/competitions';
import {getCompetitorDetail} from '@/services/competitors';
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
  createdAt: string;
  updatedAt: string;
}

interface Competition {
  id: number;
  name: string;
}

interface Stage {
  id: number;
  name: string;
  competitionId: number;
}

interface Competitor {
  id: number;
  realName: string;
  bBoyName?: string;
  competitionId: number;
}

// 对阵状态映射
const battleStatusMap: Record<string, { color: string; text: string }> = {
  scheduled: { color: 'default', text: '待进行' },
  in_progress: { color: 'blue', text: '进行中' },
  completed: { color: 'green', text: '已完成' }
};

const BattlesList: React.FC = (params: CompetitionListParams) => {
  const [loading, setLoading] = useState(false);
  const [battles, setBattles] = useState<BattleData[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [competitionId, setCompetitionId] = useState<number | undefined>(undefined);
  const [stageId, setStageId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchBattles();
    fetchCompetitions();
  }, [current, pageSize]);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      const params: any = {
        current,
        pageSize
      };

      if (stageId) {
        params.stageId = stageId;
        const battlesListResponse = await getBattlesByStageId(stageId);
        console.log('Battles response by stageId:', battlesListResponse);
        setBattles(battlesListResponse || []);
      }

      if (competitionId) {
        params.competitionId = competitionId;
        const battlesListResponse = await getBattlesByCompetitionId(competitionId);
        console.log('Battles response by competitionId:', battlesListResponse);
        setBattles(battlesListResponse || []);
      }

      // todo 解决根据比赛id和阶段id查询不准确的问题
      console.log('Fetching battles with params:', params);
      const battlesListResponse = await getBattlesList(params);
      console.log('Battles response:', battlesListResponse);
      setBattles(battlesListResponse || []);
    } catch (error) {
      console.error('获取对阵列表失败:', error);
      message.error('获取对阵列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const response = await getCompetitionsList(1, 10, '');
      console.log('Competitions response:', response);
      setCompetitions(response?.data?.items || []);
    } catch (error) {
      console.error('获取比赛列表失败:', error);
      message.error('获取比赛列表失败');
    }
  };

  const fetchStages = async (competitionId: number) => {
    try {
      const response = await getCompetitionStages(competitionId);
      console.log('Stages response:', response);
      setStages(response.data || []);
    } catch (error) {
      console.error('获取比赛阶段失败:', error);
      message.error('获取比赛阶段失败');
    }
  };

  const fetchCompetitors = async (competitionId: number) => {
    try {
      const response = await getCompetitorDetail(competitionId);
      console.log('Competitors response:', response);
      setCompetitors([response.competition] || []);
    } catch (error) {
      console.error('获取选手列表失败:', error);
      message.error('获取选手列表失败');
    }
  };

  const handleDeleteBattle = async (id: number) => {
    try {
      await deleteBattle(id);
      message.success('对阵删除成功');
      fetchBattles();
    } catch (error) {
      console.error('删除对阵失败:', error);
      message.error('删除对阵失败');
    }
  };

  const handleCompetitionChange = (value: number) => {
    setCompetitionId(value);
    setStageId(undefined);
    setCompetitors([]);
    setStages([]);
    form.resetFields(['stageId', 'competitor1Id', 'competitor2Id']);

    if (value) {
      fetchStages(value);
      fetchCompetitors(value);
    }

    // 重新获取对战列表
    fetchBattles();
  };

  const getStatusTag = (status: string) => {
    const statusInfo = battleStatusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const filteredBattles = battles.filter(battle => {
    if (!searchText) return true;

    const competitor1Name = battle.competitor1?.bBoyName || battle.competitor1?.realName || '';
    const competitor2Name = battle.competitor2?.bBoyName || battle.competitor2?.realName || '';
    const stageName = battle.stage?.name || '';
    const competitionName = battle.competition?.name || '';

    const searchLower = searchText.toLowerCase();
    return (
      competitor1Name.toLowerCase().includes(searchLower) ||
      competitor2Name.toLowerCase().includes(searchLower) ||
      stageName.toLowerCase().includes(searchLower) ||
      competitionName.toLowerCase().includes(searchLower)
    );
  });

  const handleCreate = async (values: any) => {
    try {
      setModalLoading(true);
      console.log('Form values:', values);

      const [startTime, endTime] = values.timeRange || [];
      const data = {
        ...values,
        startTime: startTime?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime?.format('YYYY-MM-DD HH:mm:ss'),
      };
      delete data.timeRange;

      console.log('Creating battle with data:', data);
      const response = await createBattle(data);
      console.log('Create response:', response);

      message.success('创建成功');
      setModalVisible(false);
      form.resetFields();
      fetchBattles();
    } catch (error) {
      console.error('创建失败:', error);
      message.error('创建失败');
    } finally {
      setModalLoading(false);
    }
  };

  const columns: ColumnsType<BattleData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '比赛',
      dataIndex: ['competition', 'name'],
      key: 'competition',
      width: 150,
      ellipsis: true,
    },
    {
      title: '阶段',
      dataIndex: ['stage', 'name'],
      key: 'stage',
      width: 120,
      filters: Array.from(new Set(battles.map(b => b.stage?.name))).filter(Boolean).map(name => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) => record.stage?.name === value,
    },
    {
      title: '选手1',
      dataIndex: 'competitor1',
      key: 'competitor1',
      width: 120,
      render: (_, record) => (
        record.competitor1 ? (
          <a onClick={() => window.location.href = `/competitors/${record.competitor1?.id}`}>
            {record.competitor1.bBoyName || record.competitor1.realName}
          </a>
        ) : <Tag color="warning">未分配</Tag>
      ),
    },
    {
      title: '选手2',
      dataIndex: 'competitor2',
      key: 'competitor2',
      width: 120,
      render: (_, record) => (
        record.competitor2 ? (
          <a onClick={() => window.location.href = `/competitors/${record.competitor2?.id}`}>
            {record.competitor2.bBoyName || record.competitor2.realName}
          </a>
        ) : <Tag color="warning">未分配</Tag>
      ),
    },
    {
      title: '获胜者',
      dataIndex: 'winnerId',
      key: 'winner',
      width: 120,
      render: (winnerId, record) => {
        if (!winnerId) return <span>-</span>;
        const winnerName =
          winnerId === record.competitor1?.id
            ? (record.competitor1.bBoyName || record.competitor1.realName)
            : (record.competitor2?.bBoyName || record.competitor2?.realName);
        return <Tag color="gold">{winnerName}</Tag>;
      },
    },
    {
      title: '对战顺序',
      dataIndex: 'battleOrder',
      key: 'battleOrder',
      sorter: (a, b) => a.battleOrder - b.battleOrder,
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: Object.entries(battleStatusMap).map(([value, { text }]) => ({
        text,
        value,
      })),
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime) => startTime ? moment(startTime).format('YYYY-MM-DD HH:mm') : '-',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className={styles.actionColumn}>
          <a onClick={() => window.location.href = `/battles/${record.id}`}>查看</a>
          <a onClick={() => window.location.href = `/battles/${record.id}/edit`}>编辑</a>
          <Popconfirm
            title="确定要删除这个对阵吗?"
            onConfirm={() => handleDeleteBattle(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
      fixed: 'right',
      width: 150,
    },
  ];

  return (
    <div className={styles.battleContainer}>
      <Card
        title="对阵列表"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            创建对阵
          </Button>
        }
      >
        <div className={styles.filterSection}>
          <Space wrap>
            <Input
              placeholder="搜索对阵信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select
              placeholder="选择比赛"
              style={{ width: 200 }}
              allowClear
              onChange={handleCompetitionChange}
              value={competitionId}
            >
              {competitions.map(comp => (
                <Option key={comp.id} value={comp.id}>{comp.name}</Option>
              ))}
            </Select>
            <Select
              placeholder="选择阶段"
              style={{ width: 150 }}
              allowClear
              disabled={!competitionId || stages.length === 0}
              onChange={(value) => {
                setStageId(value);
                fetchBattles();
              }}
              value={stageId}
            >
              {stages.map(stage => (
                <Option key={stage.id} value={stage.id}>{stage.name}</Option>
              ))}
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchBattles}
              title="刷新"
            >
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBattles}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title="创建对战"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            status: 'scheduled',
            battleOrder: 1
          }}
        >
          <Form.Item
            name="competitionId"
            label="比赛"
            rules={[{ required: true, message: '请选择比赛' }]}
          >
            <Select
              onChange={(value) => {
                handleCompetitionChange(value);
                form.resetFields(['stageId', 'competitor1Id', 'competitor2Id']);
              }}
            >
              {competitions.map(comp => (
                <Option key={comp.id} value={comp.id}>{comp.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stageId"
            label="阶段"
            rules={[{ required: true, message: '请选择阶段' }]}
          >
            <Select disabled={!form.getFieldValue('competitionId')}>
              {stages.map(stage => (
                <Option key={stage.id} value={stage.id}>{stage.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="competitor1Id"
                label="选手1"
              >
                <Select disabled={!form.getFieldValue('competitionId')}>
                  {competitors.map(competitor => (
                    <Option key={competitor.id} value={competitor.id}>
                      {competitor.bBoyName || competitor.realName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="competitor2Id"
                label="选手2"
              >
                <Select disabled={!form.getFieldValue('competitionId')}>
                  {competitors.map(competitor => (
                    <Option key={competitor.id} value={competitor.id}>
                      {competitor.bBoyName || competitor.realName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="battleOrder"
            label="对战顺序"
            rules={[{ required: true, message: '请输入对战顺序' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

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
              <Button type="primary" htmlType="submit" loading={modalLoading}>
                创建
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BattlesList;
