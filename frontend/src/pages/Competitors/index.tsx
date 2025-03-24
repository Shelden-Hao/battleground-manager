import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Input, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const { Search } = Input;

const CompetitorsList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      // 这里应该调用真实的API
      // const response = await fetch('/api/competitors');
      // const data = await response.json();
      // setCompetitors(data);
      
      // 模拟数据
      setTimeout(() => {
        setCompetitors([
          {
            id: 1,
            name: '张三',
            englishName: 'Bboy Flash',
            gender: '男',
            age: 22,
            city: '北京',
            crew: 'Breaking Fusion',
            competitions: ['2023年全国霹雳舞锦标赛', '2024亚洲霹雳舞邀请赛'],
          },
          {
            id: 2,
            name: '李四',
            englishName: 'Bgirl Wave',
            gender: '女',
            age: 20,
            city: '上海',
            crew: 'Flow Masters',
            competitions: ['2023年全国霹雳舞锦标赛'],
          },
          {
            id: 3,
            name: '王五',
            englishName: 'Bboy Power',
            gender: '男',
            age: 25,
            city: '广州',
            crew: 'Street Style',
            competitions: ['2024年全国霹雳舞锦标赛', '2024亚洲霹雳舞邀请赛'],
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取选手列表失败');
      setLoading(false);
    }
  };

  const deleteCompetitor = async (id: number) => {
    try {
      // 这里应该调用真实的API
      // await fetch(`/api/competitors/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchCompetitors();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredCompetitors = competitors.filter(competitor => 
    competitor.name.includes(searchText) || 
    competitor.englishName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '艺名',
      dataIndex: 'englishName',
      key: 'englishName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '所属团队',
      dataIndex: 'crew',
      key: 'crew',
    },
    {
      title: '参与比赛',
      dataIndex: 'competitions',
      key: 'competitions',
      render: (competitions: string[]) => (
        <>
          {competitions.map(comp => (
            <Tag color="blue" key={comp}>
              {comp}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => history.push(`/competitors/${record.id}`)}
          >
            查看
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => history.push(`/competitors/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => deleteCompetitor(record.id)}
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
              onClick={() => history.push('/competitors/create')}
            >
              新增选手
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredCompetitors}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CompetitorsList; 