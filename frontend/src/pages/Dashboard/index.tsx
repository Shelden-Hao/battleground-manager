import React, {useEffect, useState} from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { Line } from '@ant-design/charts';
import {getCompetitionsList} from "@/services/competitions";

const Dashboard: React.FC = () => {

    useEffect(() => {
        fetchCompetitions();
    }, []);
    const [competitionList, setCompetitionList] = useState([])

    const fetchCompetitions = async () => {
        const response = await getCompetitionsList({
            page: 1,
            pageSize: 5,
        });
        setCompetitionList(response.data.items)
    }

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
  const statistics = {
    inProgressCompetitions: 5,
    registeredCompetitors: 100,
    judges: 20,
    battles: 50,
  };

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
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已注册的选手"
              value={statistics?.registeredCompetitors || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="评委数量"
              value={statistics?.judges || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总比赛场次"
              value={statistics?.battles || 0}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近比赛" style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          dataSource={competitionList || []}
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
