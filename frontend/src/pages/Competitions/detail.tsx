import React, { useState, useEffect } from 'react';
import { history, useParams } from '@umijs/max';
import { 
  Card, Descriptions, Button, Space, Tag, message, 
  Tabs, Table, Modal, Form, DatePicker, Input, Select, Popconfirm 
} from 'antd';
import { 
  ArrowLeftOutlined, EditOutlined, PlusOutlined, 
  DeleteOutlined, TrophyOutlined, TeamOutlined 
} from '@ant-design/icons';
import { getCompetitionDetail, getCompetitionStages, createCompetitionStage, deleteCompetitionStage } from '@/services/competitions';
import { formatDate } from '@/utils/utils';
import type { API } from '@/services/typings';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CompetitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitionId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [competition, setCompetition] = useState<API.Competition>();
  const [stages, setStages] = useState<API.CompetitionStage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      const [competitionResponse, stagesResponse] = await Promise.all([
        getCompetitionDetail(competitionId),
        getCompetitionStages(competitionId),
      ]);

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

  useEffect(() => {
    fetchCompetitionDetails();
  }, [competitionId]);

  const handleCreateStage = async (values: any) => {
    try {
      const [startDate, endDate] = values.dateRange;
      
      const response = await createCompetitionStage(competitionId, {
        ...values,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
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
      preliminary: '预选赛',
      quarterfinal: '四分之一决赛',
      semifinal: '半决赛',
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
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getStageTypeText(type),
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text: string) => formatDate(text, 'yyyy-MM-dd'),
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
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
              <Option value="preliminary">预选赛</Option>
              <Option value="quarterfinal">四分之一决赛</Option>
              <Option value="semifinal">半决赛</Option>
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