import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const CompetitionsList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      // 这里应该调用真实的API
      // const response = await fetch('/api/competitions');
      // const data = await response.json();
      // setCompetitions(data);
      // setLoading(false);

      // 模拟数据
      setTimeout(() => {
        setCompetitions([
          {
            id: 1,
            name: '2023年全国霹雳舞锦标赛',
            location: '北京',
            startDate: '2023-10-15',
            endDate: '2023-10-18',
            status: '已结束',
          },
          {
            id: 2,
            name: '2024年全国霹雳舞锦标赛',
            location: '上海',
            startDate: '2024-05-10',
            endDate: '2024-05-15',
            status: '筹备中',
          },
          {
            id: 3,
            name: '2024亚洲霹雳舞邀请赛',
            location: '广州',
            startDate: '2024-08-05',
            endDate: '2024-08-10',
            status: '报名中',
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取比赛列表失败');
      setLoading(false);
    }
  };

  const deleteCompetition = async (id: number) => {
    try {
      // 这里应该调用真实的API
      // await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchCompetitions();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '比赛名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '举办地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = 'default';
        if (text === '报名中') color = 'blue';
        if (text === '进行中') color = 'green';
        if (text === '已结束') color = 'gray';
        if (text === '筹备中') color = 'gold';
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => history.push(`/competitions/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => history.push(`/competitions/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteCompetition(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title="比赛列表"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/competitions/create')}
          >
            新建比赛
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={competitions}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CompetitionsList;
