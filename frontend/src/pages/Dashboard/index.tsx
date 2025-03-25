import React from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { request, useRequest } from '@umijs/max';
import { Line } from '@ant-design/charts';

const Dashboard: React.FC = () => {
  const { data: statistics, loading } = useRequest(() => {
    return request('/api/statistics');
  });

  const { data: recentCompetitions } = useRequest(() => {
    return request('/api/competitions', {
      params: {
        current: 1,
        pageSize: 5,
        status: 'in_progress',
      },
    });
  });

  const competitionColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地点',
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
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          draft: { text: '草稿', color: '#d9d9d9' },
          registration: { text: '报名中', color: '#1890ff' },
          in_progress: { text: '进行中', color: '#52c41a' },
          completed: { text: '已结束', color: '#faad14' },
        };
        return (
          <span style={{ color: statusMap[status]?.color }}>
            {statusMap[status]?.text || status}
          </span>
        );
      },
    },
  ];

  // 模拟数据
  const data = [
    { year: '2019', value: 3 },
    { year: '2020', value: 4 },
    { year: '2021', value: 6 },
    { year: '2022', value: 8 },
    { year: '2023', value: 12 },
  ];

  const config = {
    data,
    height: 300,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中的比赛"
              value={statistics?.inProgressCompetitions || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已注册的选手"
              value={statistics?.registeredCompetitors || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="评委数量"
              value={statistics?.judges || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总比赛场次"
              value={statistics?.battles || 0}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近比赛" style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          dataSource={recentCompetitions?.data || []}
          columns={competitionColumns}
          pagination={false}
        />
      </Card>

      <Card title="历年比赛统计" style={{ marginTop: 16 }}>
        <Line {...config} />
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
