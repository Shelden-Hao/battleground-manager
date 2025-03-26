import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  Card, Table, Button, Space, Tag, Input, message, 
  Popconfirm, Modal, Form, DatePicker, InputNumber, Select 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, EyeOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getCompetitionsList, createCompetition, deleteCompetition } from '@/services/competitions';
import { formatDate, parseDate } from '@/utils/utils';
import type { API } from '@/services/typings';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CompetitionsList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showListPage = location.pathname === '/competitions';

  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState<API.Competition[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await getCompetitionsList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: keyword,
      });
      if (response.success) {
        setCompetitions(response.data.items);
        setPagination({
          ...pagination,
          total: response.data.total,
        });
      } else {
        message.error('获取比赛列表失败');
      }
    } catch (error) {
      message.error('获取比赛列表失败');
      console.error('获取比赛列表错误:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showListPage) {
      fetchCompetitions();
    }
  }, [pagination.current, pagination.pageSize, keyword, showListPage]);

  const handleCreate = async (values: any) => {
    try {
      const [startDate, endDate] = values.dateRange || [];
      const [_, registrationDeadline] = values.registrationDateRange || [];
      
      const data = {
        name: values.name,
        description: values.description,
        location: values.location,
        maxParticipants: values.maxParticipants,
        startDate: startDate?.format('YYYY-MM-DD'),
        endDate: endDate?.format('YYYY-MM-DD'),
        registrationDeadline: registrationDeadline?.format('YYYY-MM-DD'),
        status: values.status
      };

      const response = await createCompetition(data);

      if (response.success) {
        message.success('创建比赛成功');
        setModalVisible(false);
        form.resetFields();
        fetchCompetitions();
      } else {
        message.error('创建比赛失败');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建比赛失败');
      console.error('创建比赛错误:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteCompetition(id);
      if (response.success) {
        message.success('删除比赛成功');
        fetchCompetitions();
      } else {
        message.error('删除比赛失败');
      }
    } catch (error) {
      message.error('删除比赛失败');
      console.error('删除比赛错误:', error);
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
    };
    return texts[status] || status;
  };

  const columns: ColumnsType<API.Competition> = [
    {
      title: '比赛名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '比赛时间',
      key: 'date',
      render: (_, record: API.Competition) => (
        `${formatDate(record.startDate, 'yyyy-MM-dd')} - ${formatDate(record.endDate, 'yyyy-MM-dd')}`
      ),
    },
    {
      title: '比赛地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '报名截止',
      dataIndex: 'registrationDeadline',
      key: 'registrationDeadline',
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
      render: (_, record: API.Competition) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/competitions/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/competitions/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个比赛吗？"
            onConfirm={() => handleDelete(record.id)}
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

  if (!showListPage) {
    return <Outlet />;
  }

  return (
    <Card
      title="比赛管理"
      extra={
        <Space>
          <Input 
            placeholder="搜索比赛" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onPressEnter={fetchCompetitions}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新建比赛
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={competitions}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={(newPagination) => {
          setPagination({
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 10,
            total: pagination.total,
          });
        }}
      />

      <Modal
        title="新建比赛"
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
        >
          <Form.Item
            name="name"
            label="比赛名称"
            rules={[{ required: true, message: '请输入比赛名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="比赛描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="比赛时间"
            rules={[{ required: true, message: '请选择比赛时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="location"
            label="比赛地点"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="maxParticipants"
            label="最大参赛人数"
            rules={[{ required: true, message: '请输入最大参赛人数' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="registrationDateRange"
            label="报名时间"
            rules={[{ required: true, message: '请选择报名时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="比赛状态"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="registration">报名中</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已结束</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
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
    </Card>
  );
};

export default CompetitionsList; 