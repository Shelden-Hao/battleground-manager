import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, message, Space, Tag, Modal, Form, Select } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;
const { confirm } = Modal;

interface UserType {
  id: number;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'judge' | 'competitor' | 'staff';
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 实际项目中这里应该调用API获取数据
      // const response = await getUsersList();
      // setUsers(response);
      
      // 模拟数据获取
      setTimeout(() => {
        const roles: Array<'admin' | 'judge' | 'competitor' | 'staff'> = ['admin', 'judge', 'competitor', 'staff'];
        const mockData: UserType[] = Array.from({ length: 20 }).map((_, index) => ({
          id: index + 1,
          username: `user${index + 1}`,
          name: index % 3 === 0 ? undefined : `用户${index + 1}`,
          email: `user${index + 1}@example.com`,
          phone: index % 4 === 0 ? undefined : `1381234${(10000 + index).toString().substring(1)}`,
          role: roles[index % roles.length],
          createdAt: `2023-02-${10 + (index % 20)}T08:00:00Z`,
          updatedAt: `2023-02-${15 + (index % 15)}T09:30:00Z`,
        }));
        setUsers(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取用户列表失败');
      setLoading(false);
    }
  };

  const deleteUser = (id: number) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个用户吗？此操作不可恢复。',
      onOk: async () => {
        try {
          // 实际项目中应该调用API删除用户
          // await deleteUserById(id);
          
          // 模拟删除
          setUsers(users.filter(user => user.id !== id));
          message.success('用户删除成功');
        } catch (error) {
          message.error('删除用户失败');
        }
      },
    });
  };

  const handleAddOrEdit = (user?: UserType) => {
    setEditingUser(user || null);
    form.resetFields();
    
    if (user) {
      form.setFieldsValue(user);
    }
    
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑现有用户
        // 实际项目中应该调用API更新用户
        // await updateUser({
        //   id: editingUser.id,
        //   ...values,
        // });
        
        // 模拟更新
        setUsers(users.map(user => {
          if (user.id === editingUser.id) {
            return {
              ...user,
              ...values,
              updatedAt: new Date().toISOString(),
            };
          }
          return user;
        }));
        
        message.success('用户更新成功');
      } else {
        // 添加新用户
        // 实际项目中应该调用API创建用户
        // const response = await createUser(values);
        
        // 模拟创建
        const newUser: UserType = {
          id: Math.max(...users.map(u => u.id), 0) + 1,
          username: values.username,
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setUsers([...users, newUser]);
        message.success('用户创建成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      // 表单验证错误
    }
  };

  const getRoleTag = (role: string) => {
    const roleMap: Record<string, { color: string; text: string }> = {
      admin: { color: 'red', text: '管理员' },
      judge: { color: 'blue', text: '评委' },
      competitor: { color: 'green', text: '选手' },
      staff: { color: 'orange', text: '工作人员' },
    };
    
    const roleInfo = roleMap[role] || { color: 'default', text: role };
    return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
  };

  const filteredUsers = users.filter(user => {
    return (
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.name?.toLowerCase().includes(searchText.toLowerCase()) || false) ||
      (user.email?.toLowerCase().includes(searchText.toLowerCase()) || false) ||
      (user.phone?.includes(searchText) || false)
    );
  });

  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name) => name || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (email) => email || '-',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone) => phone || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => getRoleTag(role),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '评委', value: 'judge' },
        { text: '选手', value: 'competitor' },
        { text: '工作人员', value: 'staff' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleAddOrEdit(record)}>编辑</a>
          <a onClick={() => deleteUser(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title="用户管理"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => handleAddOrEdit()}
          >
            添加用户
          </Button>
        }
      >
        <div className={styles.tableHeader}>
          <Input
            placeholder="搜索用户名、姓名、邮箱或电话"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: 'staff' }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="姓名"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="电话"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="judge">评委</Option>
              <Option value="competitor">选手</Option>
              <Option value="staff">工作人员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 