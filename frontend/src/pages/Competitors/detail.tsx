import React, {useEffect, useState} from 'react';
import {history, useParams} from '@umijs/max';
import {Button, Card, Col, Descriptions, message, Row, Space, Statistic, Table, Tag} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {getCompetitorDetail} from '@/services/competitors';

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
      setCompetitor(response);
      console.log('Competitor data:', response);
    } catch (error) {
      console.error('获取选手信息失败:', error);
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
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'draft' ? 'default' :
          status === 'registration' ? 'blue' :
          status === 'in_progress' ? 'green' :
          'purple'
        }>
          {status === 'draft' ? '草稿' :
           status === 'registration' ? '报名中' :
           status === 'in_progress' ? '进行中' :
           '已结束'}
        </Tag>
      )
    },
  ];

  if (!competitor) {
    return <div>加载中...</div>;
  }

  // 添加调试日志
  console.log('Rendering competitor:', competitor);

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
              <Descriptions.Item label="姓名">{competitor.realName}</Descriptions.Item>
              <Descriptions.Item label="注册编号">{competitor.registrationNumber || '未设置'}</Descriptions.Item>
              {competitor.photoUrl && (
                <Descriptions.Item label="头像">
                  <img
                    src={competitor.photoUrl}
                    alt="头像"
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  />
                </Descriptions.Item>
              )}
              <Descriptions.Item label="艺名">{competitor.bBoyName || '未设置'}</Descriptions.Item>
              <Descriptions.Item label="性别">
                <Tag color={competitor.gender === 'male' ? 'blue' : competitor.gender === 'female' ? 'pink' : 'purple'}>
                  {competitor.gender === 'male' ? '男' : competitor.gender === 'female' ? '女' : '其他'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="出生日期">{competitor.birthDate || '未设置'}</Descriptions.Item>
              <Descriptions.Item label="国籍">{competitor.nationality || '未设置'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  competitor.status === 'registered' ? 'blue' :
                  competitor.status === 'qualified' ? 'green' :
                  'red'
                }>
                  {competitor.status === 'registered' ? '已注册' :
                   competitor.status === 'qualified' ? '已晋级' :
                   '已淘汰'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="舞团">{competitor.team || '未设置'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{new Date(competitor.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{new Date(competitor.updatedAt).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="参赛记录">
            {competitor.competition ? (
              <Table
                columns={columns}
                dataSource={[competitor.competition]}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <div>暂无参赛记录</div>
            )}
          </Card>
        </Col>
        <Col span={24}>
          <Card title="统计信息">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="参赛次数"
                  value={competitor.competitions ? competitor.competitions.length : 0}
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
