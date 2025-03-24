import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, message, Tag, Space, Select, Popconfirm, Tooltip } from 'antd';
import { history } from '@umijs/max';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { getBattlesList, getBattlesByCompetition, getBattlesByStage, deleteBattle } from '@/services/battles';
import { formatDate } from '@/utils/utils';

const { Option } = Select;

// 对阵状态映射
const battleStatusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'blue', text: '待进行' },
  inProgress: { color: 'orange', text: '进行中' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' }
};

const BattlesList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [battles, setBattles] = useState<API.Battle[]>([]);
  const [searchText, setSearchText] = useState('');
  const [competitionId, setCompetitionId] = useState<number | undefined>(undefined);
  const [stageId, setStageId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchBattles();
  }, [competitionId, stageId]);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      let response;
      
      if (stageId) {
        response = await getBattlesByStage(stageId);
      } else if (competitionId) {
        response = await getBattlesByCompetition(competitionId);
      } else {
        response = await getBattlesList();
      }
      
      setBattles(response);
      setLoading(false);
    } catch (error) {
      message.error('获取对阵列表失败');
      setLoading(false);
    }
  };

  const handleDeleteBattle = async (id: number) => {
    try {
      await deleteBattle(id);
      message.success('对阵删除成功');
      fetchBattles();
    } catch (error) {
      message.error('删除对阵失败');
    }
  };

  const getStatusTag = (status: string) => {
    const statusInfo = battleStatusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const filteredBattles = battles.filter(battle => {
    const competitor1Name = battle.competitor1?.bBoyName || battle.competitor1?.realName || '';
    const competitor2Name = battle.competitor2?.bBoyName || battle.competitor2?.realName || '';
    const stageName = battle.stage?.name || '';
    
    return (
      competitor1Name.toLowerCase().includes(searchText.toLowerCase()) ||
      competitor2Name.toLowerCase().includes(searchText.toLowerCase()) ||
      stageName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns: ColumnsType<API.Battle> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '比赛阶段',
      dataIndex: ['stage', 'name'],
      key: 'stage',
      filters: Array.from(new Set(battles.map(b => b.stage?.name))).filter(Boolean).map(name => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) => record.stage?.name === value,
      width: 140,
    },
    {
      title: '选手1',
      dataIndex: ['competitor1'],
      key: 'competitor1',
      render: (_, record) => (
        record.competitor1 ? (
          <a onClick={() => history.push(`/competitors/${record.competitor1?.id}`)}>
            {record.competitor1?.bBoyName || record.competitor1?.realName}
          </a>
        ) : <Tag color="warning">未分配</Tag>
      ),
      width: 160,
    },
    {
      title: '选手2',
      dataIndex: ['competitor2'],
      key: 'competitor2',
      render: (_, record) => (
        record.competitor2 ? (
          <a onClick={() => history.push(`/competitors/${record.competitor2?.id}`)}>
            {record.competitor2?.bBoyName || record.competitor2?.realName}
          </a>
        ) : <Tag color="warning">未分配</Tag>
      ),
      width: 160,
    },
    {
      title: '获胜者',
      dataIndex: 'winnerId',
      key: 'winner',
      render: (winnerId, record) => {
        if (!winnerId) return <span>-</span>;
        const winnerName = 
          winnerId === record.competitor1?.id 
            ? (record.competitor1?.bBoyName || record.competitor1?.realName) 
            : (record.competitor2?.bBoyName || record.competitor2?.realName);
        return <Tag color="gold">{winnerName}</Tag>;
      },
      width: 160,
    },
    {
      title: '对阵顺序',
      dataIndex: 'battleOrder',
      key: 'battleOrder',
      sorter: (a, b) => a.battleOrder - b.battleOrder,
      width: 100,
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
      width: 120,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime) => startTime ? formatDate(startTime) : '-',
      width: 150,
      sorter: (a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return -1;
        if (!b.startTime) return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => history.push(`/battles/${record.id}`)}>查看</a>
          <a onClick={() => history.push(`/battles/edit/${record.id}`)}>编辑</a>
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
      width: 180,
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title="对阵列表"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => history.push('/battles/create')}
          >
            创建对阵
          </Button>
        }
      >
        <div className={styles.tableHeader}>
          <Space>
            <Input
              placeholder="搜索对阵信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Tooltip title="按比赛筛选">
              <Select 
                placeholder="选择比赛"
                style={{ width: 200 }}
                allowClear
                onChange={(value: any) => setCompetitionId(value)}
              >
                {/* 实际项目中应从API获取比赛列表 */}
                <Option value={1}>2023世界街舞锦标赛</Option>
                <Option value={2}>全国霹雳舞大赛</Option>
              </Select>
            </Tooltip>
            <Tooltip title="按阶段筛选">
              <Select 
                placeholder="选择阶段"
                style={{ width: 150 }}
                allowClear
                onChange={(value: any) => setStageId(value)}
                disabled={!competitionId}
              >
                {/* 实际项目中应从API获取阶段列表 */}
                <Option value={1}>预选赛</Option>
                <Option value={2}>16强赛</Option>
                <Option value={3}>8强赛</Option>
                <Option value={4}>4强赛</Option>
                <Option value={5}>决赛</Option>
              </Select>
            </Tooltip>
            <Button onClick={fetchBattles}>刷新</Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredBattles}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default BattlesList; 