import { useState } from 'react';
import { Form, Input, Typography, Card, List, Divider, Tag, Select, Empty, Tooltip } from 'antd';
import { ApiOutlined, ToolOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { FlowNode, AgentNodeData } from '@/types';
import { useFlowStore } from '@/store/flowStore';

interface AgentConfigProps {
  node: FlowNode;
  data: AgentNodeData;
}

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AgentConfig = ({ node, data }: AgentConfigProps) => {
  const { updateNodeData, nodes } = useFlowStore();
  const [formData, setFormData] = useState({
    name: data.name || '',
    instructions: data.instructions || '',
    handoff_description: data.handoff_description || '',
    output_type: data.output_type || '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { [name]: value });
  };

  // 获取已连接的 handoffs 和 tools 的详细信息
  const getConnectedNodeDetails = (nodeIds: string[] = []) => {
    return nodeIds.map(id => {
      const connectedNode = nodes.find(n => n.id === id);
      return {
        id,
        name: connectedNode?.data.name || '未命名',
        type: connectedNode?.type || '未知'
      };
    });
  };

  const handoffDetails = getConnectedNodeDetails(data.handoffs);
  const toolDetails = getConnectedNodeDetails(data.tools);

  // 判断是否是自定义模型
  const isCustomModel = formData.output_type && formData.output_type !== 'none' && formData.output_type !== 'custom';
  const displayValue = isCustomModel ? formData.output_type : (formData.output_type || 'none');

  return (
    <div>
      <Title level={5} style={{ color: '#3498db', marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <ApiOutlined style={{ marginRight: 8 }} /> Agent 节点设置
      </Title>
      
      <Form layout="vertical">
        <Form.Item label="名称" required>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="输入 Agent 名称"
          />
        </Form.Item>
        
        <Form.Item label="指令" required>
          <TextArea
            value={formData.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder="输入 Agent 指令"
            rows={4}
          />
        </Form.Item>
        
        <Form.Item label="转交描述 (可选)">
          <Input
            value={formData.handoff_description}
            onChange={(e) => handleChange('handoff_description', e.target.value)}
            placeholder="描述此 Agent 如何转交给其他 Agent"
          />
        </Form.Item>
        
        <Form.Item 
          label="输出类型" 
          tooltip={{ 
            title: '选择 Agent 的输出类型，可以是无或自定义 Pydantic 模型',
            icon: <InfoCircleOutlined /> 
          }}
        >
          <Select
            value={isCustomModel ? 'custom' : displayValue}
            onChange={(value) => handleChange('output_type', value)}
            style={{ width: '100%' }}
          >
            <Option value="none">无</Option>
            <Option value="custom">自定义 Pydantic 模型</Option>
          </Select>
          
          {(displayValue === 'custom' || isCustomModel) && (
            <Input
              value={isCustomModel ? formData.output_type : ''}
              onChange={(e) => handleChange('output_type', e.target.value)}
              placeholder="Pydantic 模型名称, 如 HomeworkOutput"
              style={{ marginTop: 8 }}
            />
          )}
        </Form.Item>
      </Form>
      
      <Divider orientation="left">连接项</Divider>
      
      <Card 
        size="small" 
        title={<Text type="secondary"><ApiOutlined /> 可转交代理</Text>}
        style={{ marginBottom: 16 }}
      >
        {handoffDetails.length > 0 ? (
          <List
            size="small"
            dataSource={handoffDetails}
            renderItem={(handoff) => (
              <List.Item>
                <Tooltip title={`ID: ${handoff.id}`}>
                  <Tag color="#3498db" style={{ display: 'flex', alignItems: 'center' }}>
                    <ApiOutlined style={{ marginRight: 4 }} />
                    {handoff.name}
                  </Tag>
                </Tooltip>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="暂无连接的代理" 
            style={{ margin: '8px 0' }} 
          />
        )}
      </Card>
      
      <Card 
        size="small" 
        title={<Text type="secondary"><ToolOutlined /> 可用工具</Text>}
        style={{ marginBottom: 16 }}
      >
        {toolDetails.length > 0 ? (
          <List
            size="small"
            dataSource={toolDetails}
            renderItem={(tool) => (
              <List.Item>
                <Tooltip title={`ID: ${tool.id}`}>
                  <Tag color="#f39c12" style={{ display: 'flex', alignItems: 'center' }}>
                    <ToolOutlined style={{ marginRight: 4 }} />
                    {tool.name}
                  </Tag>
                </Tooltip>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="暂无连接的工具" 
            style={{ margin: '8px 0' }} 
          />
        )}
      </Card>
      
      <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 16 }}>
        提示: 连接其他 Agent 节点作为 handoffs (转交)，连接 Function Tool 节点作为工具。
      </Paragraph>
    </div>
  );
};

export default AgentConfig;
