import React, { useState, useEffect } from 'react';
import { Card, Form, Button, message, Space, Select, DatePicker, Input, Alert } from 'antd';
import { history, useParams } from '@umijs/max';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

const BattleForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [competitions, setCompetitions] = useState<API.Competition[]>([]);
  const [stages, setStages] = useState<API.CompetitionStage[]>([]);
  const [competitors, setCompetitors] = useState<API.Competitor[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<API.Battle>>({});
  
  const isEditing = !!id;

  useEffect(() => {
    fetchCompetitions();
    if (isEditing) {
      fetchBattleDetails();
    }
  }, [id]);

  useEffect(() => {
    if (selectedCompetitionId) {
      fetchStages(selectedCompetitionId);
      fetchCompetitors(selectedCompetitionId);
    }
  }, [selectedCompetitionId]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      // 实际项目中应调用API获取比赛数据
      // const response = await getCompetitionsList();
      // setCompetitions(response);
      
      // 模拟数据
      setTimeout(() => {
        const mockData: API.Competition[] = Array.from({ length: 5 }).map((_, index) => ({
          id: index + 1,
          name: `2023年第${index + 1}届霹雳舞锦标赛`,
          description: `2023年第${index + 1}届霹雳舞锦标赛详细描述`,
          startDate: `2023-0${index + 3}-01`,
          endDate: `2023-0${index + 3}-05`,
          location: `城市${index + 1}体育馆`,
          status: ['draft', 'registration', 'in_progress', 'completed'][index % 4] as 'draft' | 'registration' | 'in_progress' | 'completed',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-10T00:00:00Z',
        }));
        setCompetitions(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取比赛列表失败');
      setLoading(false);
    }
  };

  const fetchStages = async (competitionId: number) => {
    try {
      setLoading(true);
      // 实际项目中应调用API获取比赛阶段数据
      // const response = await getStagesByCompetitionId(competitionId);
      // setStages(response);
      
      // 模拟数据
      setTimeout(() => {
        const stageTypes: Array<'qualification' | 'top_16' | 'top_8' | 'top_4' | 'final'> = [
          'qualification', 'top_16', 'top_8', 'top_4', 'final'
        ];
        const stageNames = ['预选赛', '16强赛', '8强赛', '4强赛', '决赛'];
        
        const mockData: API.CompetitionStage[] = stageTypes.map((type, index) => ({
          id: index + 1,
          competitionId,
          name: stageNames[index],
          description: `${stageNames[index]}描述`,
          stageOrder: index + 1,
          stageType: type,
          startTime: index > 0 ? `2023-03-0${index + 1}T09:00:00Z` : undefined,
          endTime: index > 0 ? `2023-03-0${index + 1}T18:00:00Z` : undefined,
          status: ['pending', 'in_progress', 'completed'][index % 3] as 'pending' | 'in_progress' | 'completed',
          createdAt: '2023-02-01T00:00:00Z',
          updatedAt: '2023-02-10T00:00:00Z',
        }));
        setStages(mockData);
        setLoading(false);
      }, 300);
    } catch (error) {
      message.error('获取比赛阶段失败');
      setLoading(false);
    }
  };

  const fetchCompetitors = async (competitionId: number) => {
    try {
      setLoading(true);
      // 实际项目中应调用API获取选手数据
      // const response = await getCompetitorsByCompetitionId(competitionId);
      // setCompetitors(response);
      
      // 模拟数据
      setTimeout(() => {
        const mockData: API.Competitor[] = Array.from({ length: 16 }).map((_, index) => ({
          id: 100 + index,
          competitionId,
          registrationNumber: `R${2023}${competitionId}${100 + index}`,
          bBoyName: `Bboy Star${index + 1}`,
          realName: `选手${index + 1}`,
          gender: index % 3 === 0 ? 'female' : 'male',
          birthDate: `199${index % 10}-01-01`,
          nationality: '中国',
          team: `Dance Crew ${index % 5 + 1}`,
          photoUrl: `https://example.com/photos/${index + 1}.jpg`,
          status: ['registered', 'qualified', 'eliminated'][index % 3] as 'registered' | 'qualified' | 'eliminated',
          createdAt: '2023-02-01T00:00:00Z',
          updatedAt: '2023-02-10T00:00:00Z',
        }));
        setCompetitors(mockData);
        setLoading(false);
      }, 300);
    } catch (error) {
      message.error('获取选手列表失败');
      setLoading(false);
    }
  };

  const fetchBattleDetails = async () => {
    try {
      setLoading(true);
      // 实际项目中应调用API获取对阵详情
      // const response = await getBattleById(id);
      // const battleData = response;
      
      // 模拟数据
      setTimeout(() => {
        const battleData: API.Battle = {
          id: Number(id),
          competitionId: 1,
          stageId: 2,
          competitor1Id: 101,
          competitor2Id: 102,
          battleOrder: 1,
          winnerId: undefined,
          status: 'scheduled',
          startTime: '2023-03-15T14:00:00Z',
          endTime: undefined,
          createdAt: '2023-03-01T00:00:00Z',
          updatedAt: '2023-03-01T00:00:00Z',
        };
        
        setInitialValues(battleData);
        setSelectedCompetitionId(battleData.competitionId);
        
        form.setFieldsValue({
          ...battleData,
          startTime: battleData.startTime ? moment(battleData.startTime) : undefined,
          endTime: battleData.endTime ? moment(battleData.endTime) : undefined,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取对阵详情失败');
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      
      const submitData = {
        ...values,
        startTime: values.startTime ? values.startTime.toISOString() : undefined,
        endTime: values.endTime ? values.endTime.toISOString() : undefined,
      };

      if (isEditing) {
        // 实际项目中应调用API更新对阵
        // await updateBattle(id, submitData);
        console.log('Update battle with data:', submitData);
        message.success('对阵更新成功');
      } else {
        // 实际项目中应调用API创建对阵
        // await createBattle(submitData);
        console.log('Create battle with data:', submitData);
        message.success('对阵创建成功');
      }
      
      setTimeout(() => {
        history.push('/battles');
      }, 1000);
    } catch (error) {
      message.error('保存对阵失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompetitionChange = (value: number) => {
    setSelectedCompetitionId(value);
    form.setFieldsValue({
      stageId: undefined,
      competitor1Id: undefined,
      competitor2Id: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.push('/battles')}
        style={{ marginBottom: 16 }}
      >
        返回对阵列表
      </Button>

      <Card
        title={isEditing ? '编辑对阵' : '创建对阵'}
        className={styles.card}
        loading={loading}
      >
        <Alert
          message={isEditing ? "编辑现有对阵" : "创建新对阵"}
          description={
            isEditing 
              ? "您正在编辑现有对阵信息，请填写下面的表单并保存更改。" 
              : "创建新对阵，请选择比赛、阶段和两名参赛选手，然后设置对阵顺序和时间。"
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          <Form.Item
            name="competitionId"
            label="选择比赛"
            rules={[{ required: true, message: '请选择比赛' }]}
          >
            <Select
              placeholder="选择比赛"
              onChange={handleCompetitionChange}
              disabled={isEditing}
            >
              {competitions.map(competition => (
                <Option key={competition.id} value={competition.id}>{competition.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stageId"
            label="比赛阶段"
            rules={[{ required: true, message: '请选择比赛阶段' }]}
          >
            <Select
              placeholder="选择比赛阶段"
              disabled={!selectedCompetitionId}
            >
              {stages.map(stage => (
                <Option key={stage.id} value={stage.id}>{stage.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="battleOrder"
            label="对阵顺序"
            rules={[{ required: true, message: '请输入对阵顺序' }]}
          >
            <Input type="number" min={1} placeholder="输入数字，如 1、2、3..." />
          </Form.Item>

          <Form.Item
            name="competitor1Id"
            label="选手 1"
            rules={[{ required: true, message: '请选择第一位选手' }]}
          >
            <Select
              placeholder="选择第一位选手"
              disabled={!selectedCompetitionId}
              showSearch
              optionFilterProp="children"
            >
              {competitors.map(competitor => (
                <Option key={competitor.id} value={competitor.id}>
                  {competitor.bBoyName || competitor.realName}
                  {competitor.bBoyName && competitor.realName ? ` (${competitor.realName})` : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="competitor2Id"
            label="选手 2"
            rules={[{ required: true, message: '请选择第二位选手' }]}
          >
            <Select
              placeholder="选择第二位选手"
              disabled={!selectedCompetitionId}
              showSearch
              optionFilterProp="children"
            >
              {competitors.map(competitor => (
                <Option key={competitor.id} value={competitor.id}>
                  {competitor.bBoyName || competitor.realName}
                  {competitor.bBoyName && competitor.realName ? ` (${competitor.realName})` : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="对阵状态"
            rules={[{ required: true, message: '请选择对阵状态' }]}
            initialValue="scheduled"
          >
            <Select placeholder="选择对阵状态">
              <Option value="scheduled">已安排</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startTime"
            label="开始时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" placeholder="选择开始时间" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="结束时间"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" placeholder="选择结束时间" />
          </Form.Item>

          <Form.Item
            name="winnerId"
            label="获胜者"
          >
            <Select placeholder="选择获胜者" allowClear>
              {form.getFieldValue('competitor1Id') && (
                <Option value={form.getFieldValue('competitor1Id')}>
                  {
                    competitors.find(c => c.id === form.getFieldValue('competitor1Id'))?.bBoyName ||
                    competitors.find(c => c.id === form.getFieldValue('competitor1Id'))?.realName ||
                    '选手 1'
                  }
                </Option>
              )}
              {form.getFieldValue('competitor2Id') && (
                <Option value={form.getFieldValue('competitor2Id')}>
                  {
                    competitors.find(c => c.id === form.getFieldValue('competitor2Id'))?.bBoyName ||
                    competitors.find(c => c.id === form.getFieldValue('competitor2Id'))?.realName ||
                    '选手 2'
                  }
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>
                {isEditing ? '更新对阵' : '创建对阵'}
              </Button>
              <Button onClick={() => history.push('/battles')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BattleForm; 