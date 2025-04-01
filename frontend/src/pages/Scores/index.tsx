import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, message, Space, Select, Form, InputNumber, Tooltip } from 'antd';
import { history } from '@umijs/max';
import { SearchOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import {getBattlesList, getScoresByBattleId} from "@/services/battles";
import {updateScore} from "@/services/competitions";

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
      const response = await getBattlesList();
      setBattles(response);
    } catch (error) {
      message.error('获取对阵列表失败');
      setLoading(false);
    }
  };

  const fetchScores = async (battleId: number) => {
    try {
      setLoading(true);
      const response = await getScoresByBattleId(battleId);
      setScores(response);

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
      await updateScore({
        id: scoreId,
        ...row,
        totalScore
      });

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
