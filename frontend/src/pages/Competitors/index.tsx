import React, { useState, useEffect } from 'react';
import {Table, Button, Space, message, Card, Input, Tag, Form, InputNumber, Select, Modal, DatePicker} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import {CompetitorListParams, createCompetitor, getCompetitorsList} from "@/services/competitors";
import {createCompetition} from "@/services/competitions";

const { Search } = Input;

const CompetitorsList: React.FC = (params: CompetitorListParams) => {
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const response = await getCompetitorsList({current, pageSize, keyword});
      setCompetitors(response);
      setLoading(false);
    } catch (error) {
      message.error('获取选手列表失败');
      setLoading(false);
    }
  };

  const deleteCompetitor = async (id: number) => {
    try {
      await deleteCompetitor(id);
      message.success('删除成功');
      fetchCompetitors();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const filteredCompetitors = () => {
    if (competitors.length !== 0) {
      return competitors.filter(competitor =>
        competitor.realName.includes(keyword)
      );
    } else {
      return [];
    }
  }

  const handleCreateCompetitor = async (values: any) => {
    try {
      const submitData = { ...values };
      await createCompetitor(submitData);
      message.success('创建选手成功');
      setModalVisible(false);
      form.resetFields();
      fetchCompetitors();
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建选手失败');
      console.error('创建选手错误:', error);
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      fixed: 'left',
    },
    {
      title: '注册编号',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
    },
    {
      title: '注册状态',
      dataIndex: 'status',
      key: 'status',
    },

    {
      title: '艺名',
      dataIndex: 'bBoyName',
      key: 'bBoyName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: '头像',
      dataIndex: 'photoUrl',
      render: (photoUrl: string) => (
          <img
              src={photoUrl}
              alt="Avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
      ),
    },
    {
      title: '团队',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: '参与比赛',
      dataIndex: 'competition',
      key: 'competition',
      render: (competition: string[]) => (
        <>

            <Tag color="blue" key={competition.name}>
              {competition.name}
            </Tag>

        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/competitors/${record.id}`)}
          >

          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => history.push(`/competitors/${record.id}/edit`)}
          >

          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteCompetitor(record.id)}
          >

          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title="选手列表"
        extra={
          <Space>
            <Search
              placeholder="搜索选手"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              新增选手
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          dataSource={filteredCompetitors()}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Modal
          title="新增选手"
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
            onFinish={handleCreateCompetitor}
            initialValues={{
              gender: 'male',
              status: 'registered',
            }}
        >
          <Form.Item
              name="realName"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="bBoyName"
              label="艺名"
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="registrationNumber"
              label="注册编号"
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
              name="birthDate"
              label="出生日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
              name="nationality"
              label="国籍"
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="team"
              label="舞团"
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="status"
              label="状态"
          >
            <Select>
              <Option value="registered">已注册</Option>
              <Option value="qualified">已晋级</Option>
              <Option value="eliminated">已淘汰</Option>
            </Select>
          </Form.Item>

          <Form.Item
              name="photoUrl"
              label="头像URL"
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="competitionId"
              label="关联比赛ID"
              rules={[{ required: true, message: '请输入关联比赛ID' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
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
    </div>
  );
};

export default CompetitorsList;
