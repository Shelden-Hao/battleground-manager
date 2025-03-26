import React, { useState, useEffect } from 'react';
import { useParams, history } from '@umijs/max';
import { 
  Card, Descriptions, Button, Space, message,
  Table, Tag, Row, Col, Statistic 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCompetitorDetail } from '@/services/competitors';

const CompetitorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const competitorId = parseInt(id);
  
  const [loading, setLoading] = useState(false);
  const [competitor, setCompetitor] = useState<any>(null);

  useEffect(() => {
    fetchCompetitorDetails();
  }, [competitorId]);

  const fetchCompetitorDetails = async () => {
    try {
      setLoading(true);
      const response = await getCompetitorDetail(competitorId);
      if (response.success) {
        setCompetitor(response.data);
      }
    } catch (error) {
      message.error('获取选手信息失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '比赛名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '比赛时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '成绩',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? '已完成' : '进行中'}
        </Tag>
      ),
    },
  ];

  if (!competitor) {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push('/competitors')}
            type="link"
          />
          <span>选手详情</span>
        </Space>
      }
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions title="基本信息" bordered>
              <Descriptions.Item label="姓名">{competitor.name}</Descriptions.Item>
              <Descriptions.Item label="英文名">{competitor.englishName}</Descriptions.Item>
              <Descriptions.Item label="性别">
                <Tag color={competitor.gender === 'male' ? 'blue' : 'pink'}>
                  {competitor.gender === 'male' ? '男' : '女'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="年龄">{competitor.age}</Descriptions.Item>
              <Descriptions.Item label="城市">{competitor.city}</Descriptions.Item>
              <Descriptions.Item label="舞团">{competitor.crew}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{competitor.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{competitor.updatedAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="参赛记录">
            <Table 
              columns={columns} 
              dataSource={competitor.competitions || []}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="统计信息">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic 
                  title="参赛次数" 
                  value={competitor.competitions?.length || 0} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="胜场数" 
                  value={competitor.wins || 0} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="胜率" 
                  value={competitor.winRate || 0} 
                  suffix="%" 
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default CompetitorDetail; 