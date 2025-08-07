import { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Table, message } from 'antd';
import request from '@/utils/request';
import styles from './index.module.less';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const DemoPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取用户列表示例
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 使用封装的 request.get 方法
      // 注意：这里使用的是假的 API 地址，实际使用时需要替换为真实接口
      const res = await request.get<User[]>('/api/users', { keyword: searchTerm });
      if (res.success) {
        setUsers(res.data);
        message.success('获取用户列表成功');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      // 错误处理已在 request.ts 中进行，这里可以添加额外的处理
    } finally {
      setLoading(false);
    }
  };

  // 添加用户示例
  const addUser = async () => {
    try {
      // 使用封装的 request.post 方法
      const newUser = {
        name: '测试用户',
        email: 'test@example.com',
        phone: '13800138000'
      };
      
      const res = await request.post<User>('/api/users', newUser);
      
      if (res.success) {
        message.success('添加用户成功');
        fetchUsers(); // 重新获取列表
      }
    } catch (error) {
      console.error('添加用户失败:', error);
    }
  };

  // 修改用户示例
  const updateUser = async (id: number) => {
    try {
      const updatedUser = {
        name: '更新用户名',
        email: 'updated@example.com'
      };
      
      const res = await request.put<User>(`/api/users/${id}`, updatedUser);
      
      if (res.success) {
        message.success('修改用户成功');
        fetchUsers(); // 重新获取列表
      }
    } catch (error) {
      console.error('修改用户失败:', error);
    }
  };

  // 删除用户示例
  const deleteUser = async (id: number) => {
    try {
      const res = await request.delete<void>(`/api/users/${id}`);
      
      if (res.success) {
        message.success('删除用户成功');
        fetchUsers(); // 重新获取列表
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  // 上传文件示例
  const uploadFile = async (file: File) => {
    try {
      const res = await request.upload('/api/upload', file);
      
      if (res.success) {
        message.success('文件上传成功');
      }
    } catch (error) {
      console.error('文件上传失败:', error);
    }
  };

  // 下载文件示例
  const downloadFile = () => {
    request.download('/api/download', { fileId: '123' });
  };

  // 模拟组件初始化时获取数据
  useEffect(() => {
    // 注释掉实际请求，避免报错
    // fetchUsers();
    
    // 模拟数据
    setUsers([
      { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138001' },
      { id: 2, name: '李四', email: 'lisi@example.com', phone: '13800138002' },
      { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13800138003' },
    ]);
  }, []);

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button size="small" onClick={() => updateUser(record.id)}>修改</Button>
          <Button size="small" danger onClick={() => deleteUser(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Request 封装演示">
        <Space className={styles.toolbar} direction="horizontal" wrap>
          <Input
            placeholder="搜索用户"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={fetchUsers}>
            搜索
          </Button>
          <Button type="primary" onClick={addUser}>
            添加用户
          </Button>
          <Button onClick={() => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                uploadFile(file);
              }
            };
            fileInput.click();
          }}>
            上传文件
          </Button>
          <Button onClick={downloadFile}>
            下载文件
          </Button>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default DemoPage;