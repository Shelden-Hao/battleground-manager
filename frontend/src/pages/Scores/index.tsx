import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, message, Space, Select, Form, InputNumber, Tooltip } from 'antd';
import { history } from '@umijs/max';
import { SearchOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;

const ScoresManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [battles, setBattles] = useState<API.Battle[]>([]);
  const [scores, setScores] = useState<API.Score[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<number | null>(null);
  const [editingKey, setEditingKey] = useState<string>('');
  const [editingScores, setEditingScores] = useState<Record<string, any>>({});
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBattles();
  }, []);

  useEffect(() => {
    if (selectedBattle) {
      fetchScores(selectedBattle);
    }
  }, [selectedBattle]);

  const fetchBattles = async () => {
    try {
      setLoading(true);
      // 实际项目中应该调用API获取对阵数据
      // const response = await getBattlesList();
      // setBattles(response);
      
      // 模拟数据获取
      setTimeout(() => {
        const mockData: API.Battle[] = Array.from({ length: 10 }).map((_, index) => ({
          id: index + 1,
          competitionId: 1,
          stageId: index % 3 + 1,
          competitor1Id: 100 + index * 2,
          competitor2Id: 101 + index * 2,
          battleOrder: index + 1,
          status: ['scheduled', 'in_progress', 'completed'][index % 3] as 'scheduled' | 'in_progress' | 'completed',
          startTime: index < 5 ? `2023-03-${15 + index}T14:00:00Z` : undefined,
          endTime: index < 3 ? `2023-03-${15 + index}T14:30:00Z` : undefined,
          createdAt: `2023-03-${10 + index}T08:00:00Z`,
          updatedAt: `2023-03-${10 + index}T09:30:00Z`,
          competitor1: {
            id: 100 + index * 2,
            competitionId: 1,
            realName: `选手${index * 2 + 1}`,
            bBoyName: `Bboy Star${index * 2 + 1}`,
            gender: 'male',
            status: 'qualified',
            createdAt: '2023-02-15T08:00:00Z',
            updatedAt: '2023-03-01T10:30:00Z'
          },
          competitor2: {
            id: 101 + index * 2,
            competitionId: 1,
            realName: `选手${index * 2 + 2}`,
            bBoyName: `Bboy Star${index * 2 + 2}`,
            gender: 'male',
            status: 'qualified',
            createdAt: '2023-02-16T09:15:00Z',
            updatedAt: '2023-03-02T11:45:00Z'
          },
          stage: {
            id: index % 3 + 1,
            competitionId: 1,
            name: ['预选赛', '16强赛', '8强赛'][index % 3],
            stageOrder: index % 3 + 1,
            stageType: ['qualification', 'top_16', 'top_8'][index % 3] as 'qualification' | 'top_16' | 'top_8',
            status: 'in_progress',
            createdAt: '2023-03-01T08:00:00Z',
            updatedAt: '2023-03-10T16:00:00Z'
          }
        }));
        setBattles(mockData);
        setLoading(false);
        
        // 默认选择第一个对阵
        if (mockData.length > 0) {
          setSelectedBattle(mockData[0].id);
        }
      }, 500);
    } catch (error) {
      message.error('获取对阵列表失败');
      setLoading(false);
    }
  };

  const fetchScores = async (battleId: number) => {
    try {
      setLoading(true);
      // 实际项目中应该调用API获取评分数据
      // const response = await getScoresByBattleId(battleId);
      // setScores(response);
      
      // 模拟数据获取
      setTimeout(() => {
        const judgeIds = [1, 2, 3, 4, 5]; // 假设有5位评委
        const battle = battles.find(b => b.id === battleId);
        
        if (!battle) {
          setScores([]);
          setLoading(false);
          return;
        }
        
        const mockData: API.Score[] = [];
        
        // 为两个选手创建评分数据
        [battle.competitor1Id, battle.competitor2Id].forEach(competitorId => {
          judgeIds.forEach(judgeId => {
            // 随机生成评分，或者部分为空（表示未评分）
            const hasScore = Math.random() > 0.3;
            mockData.push({
              id: mockData.length + 1,
              battleId,
              judgeId,
              competitorId: competitorId!,
              techniqueScore: hasScore ? Math.floor(Math.random() * 31) + 70 : undefined, // 70-100
              originalityScore: hasScore ? Math.floor(Math.random() * 31) + 70 : undefined,
              musicalityScore: hasScore ? Math.floor(Math.random() * 31) + 70 : undefined,
              executionScore: hasScore ? Math.floor(Math.random() * 31) + 70 : undefined,
              totalScore: hasScore ? Math.floor(Math.random() * 31) + 70 : undefined,
              comments: hasScore ? '评委点评内容...' : undefined,
              createdAt: '2023-03-15T14:00:00Z',
              updatedAt: '2023-03-15T14:30:00Z'
            });
          });
        });
        
        setScores(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取评分数据失败');
      setLoading(false);
    }
  };

  const saveScore = async (scoreId: number) => {
    try {
      const row = editingScores[scoreId];
      if (!row) return;
      
      // 计算总分
      const techniqueScore = parseFloat(row.techniqueScore || 0);
      const originalityScore = parseFloat(row.originalityScore || 0);
      const musicalityScore = parseFloat(row.musicalityScore || 0);
      const executionScore = parseFloat(row.executionScore || 0);
      
      const totalScore = (techniqueScore + originalityScore + musicalityScore + executionScore) / 4;
      
      // 实际项目中应该调用API保存评分
      // await updateScore({
      //   id: scoreId,
      //   ...row,
      //   totalScore
      // });
      
      // 模拟保存
      setScores(scores.map(score => {
        if (score.id === scoreId) {
          return {
            ...score,
            ...row,
            totalScore
          };
        }
        return score;
      }));
      
      setEditingKey('');
      message.success('评分保存成功');
    } catch (error) {
      message.error('保存评分失败');
    }
  };

  const isEditing = (record: API.Score) => record.id.toString() === editingKey;

  const edit = (record: API.Score) => {
    form.setFieldsValue({
      techniqueScore: record.techniqueScore,
      originalityScore: record.originalityScore,
      musicalityScore: record.musicalityScore,
      executionScore: record.executionScore,
      comments: record.comments,
      ...record,
    });
    setEditingKey(record.id.toString());
    setEditingScores({
      ...editingScores,
      [record.id]: {
        techniqueScore: record.techniqueScore,
        originalityScore: record.originalityScore,
        musicalityScore: record.musicalityScore,
        executionScore: record.executionScore,
        comments: record.comments,
      }
    });
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleInputChange = (value: number | null, field: string, scoreId: number) => {
    setEditingScores({
      ...editingScores,
      [scoreId]: {
        ...editingScores[scoreId],
        [field]: value
      }
    });
  };

  const getBattleDescription = (battleId: number) => {
    const battle = battles.find(b => b.id === battleId);
    if (!battle) return '';
    
    const stageName = battle.stage?.name || '';
    const competitor1 = battle.competitor1?.bBoyName || battle.competitor1?.realName || '选手1';
    const competitor2 = battle.competitor2?.bBoyName || battle.competitor2?.realName || '选手2';
    
    return `${stageName}: ${competitor1} vs ${competitor2}`;
  };

  const getCompetitorName = (competitorId: number) => {
    const battle = battles.find(b => b.id === selectedBattle);
    if (!battle) return `选手ID: ${competitorId}`;
    
    if (battle.competitor1?.id === competitorId) {
      return battle.competitor1.bBoyName || battle.competitor1.realName || `选手ID: ${competitorId}`;
    }
    
    if (battle.competitor2?.id === competitorId) {
      return battle.competitor2.bBoyName || battle.competitor2.realName || `选手ID: ${competitorId}`;
    }
    
    return `选手ID: ${competitorId}`;
  };

  const columns: ColumnsType<API.Score> = [
    {
      title: '评委ID',
      dataIndex: 'judgeId',
      key: 'judgeId',
      width: 100,
    },
    {
      title: '选手',
      dataIndex: 'competitorId',
      key: 'competitorId',
      render: (competitorId) => getCompetitorName(competitorId),
      width: 150,
    },
    {
      title: '技术分',
      dataIndex: 'techniqueScore',
      key: 'techniqueScore',
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            min={0}
            max={100}
            value={editingScores[record.id]?.techniqueScore}
            onChange={(value) => handleInputChange(value, 'techniqueScore', record.id)}
          />
        ) : (
          <span>{record.techniqueScore || '-'}</span>
        );
      },
    },
    {
      title: '创意分',
      dataIndex: 'originalityScore',
      key: 'originalityScore',
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            min={0}
            max={100}
            value={editingScores[record.id]?.originalityScore}
            onChange={(value) => handleInputChange(value, 'originalityScore', record.id)}
          />
        ) : (
          <span>{record.originalityScore || '-'}</span>
        );
      },
    },
    {
      title: '音乐性',
      dataIndex: 'musicalityScore',
      key: 'musicalityScore',
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            min={0}
            max={100}
            value={editingScores[record.id]?.musicalityScore}
            onChange={(value) => handleInputChange(value, 'musicalityScore', record.id)}
          />
        ) : (
          <span>{record.musicalityScore || '-'}</span>
        );
      },
    },
    {
      title: '执行力',
      dataIndex: 'executionScore',
      key: 'executionScore',
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <InputNumber
            min={0}
            max={100}
            value={editingScores[record.id]?.executionScore}
            onChange={(value) => handleInputChange(value, 'executionScore', record.id)}
          />
        ) : (
          <span>{record.executionScore || '-'}</span>
        );
      },
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      render: (totalScore) => (
        <span style={{ fontWeight: 'bold' }}>{totalScore ? totalScore.toFixed(1) : '-'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => saveScore(record.id)}
              size="small"
            >
              保存
            </Button>
            <Button onClick={cancel} size="small">取消</Button>
          </Space>
        ) : (
          <Tooltip title="编辑评分">
            <Button
              type="text"
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="评分管理">
        <div className={styles.tableHeader}>
          <Space>
            <Select
              placeholder="选择对阵"
              style={{ width: 300 }}
              onChange={(value) => setSelectedBattle(Number(value))}
              value={selectedBattle}
              loading={loading}
            >
              {battles.map(battle => (
                <Option key={battle.id} value={battle.id}>{getBattleDescription(battle.id)}</Option>
              ))}
            </Select>
            
            <Input
              placeholder="搜索评委或选手"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 200 }}
            />
          </Space>
        </div>
        
        <Form form={form} component={false}>
          <Table
            columns={columns}
            dataSource={scores}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Form>
      </Card>
    </div>
  );
};

export default ScoresManagement; 