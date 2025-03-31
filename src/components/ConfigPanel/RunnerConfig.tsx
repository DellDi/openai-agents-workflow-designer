import { useState } from 'react';
import { Form, Input, Radio, Typography, Space, Alert } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { FlowNode, RunnerNodeData } from '@/types';
import { useFlowStore } from '@/store/flowStore';

interface RunnerConfigProps {
  node: FlowNode;
  data: RunnerNodeData;
}

const { TextArea } = Input;
const { Title, Text } = Typography;

const RunnerConfig = ({ node, data }: RunnerConfigProps) => {
  const { updateNodeData } = useFlowStore();
  const [formData, setFormData] = useState({
    input: data.input || '',
    mode: data.mode || 'sync',
    context: data.context || '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { [name]: value });
  };

  const handleModeChange = (e: any) => {
    const mode = e.target.value as 'sync' | 'async';
    setFormData((prev) => ({
      ...prev,
      mode,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { mode });
  };

  return (
    <div>
      <Title level={5} style={{ color: '#e74c3c', marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <RocketOutlined style={{ marginRight: 8 }} /> Runner 执行器设置
      </Title>
      
      <Form layout="vertical">
        <Form.Item label="输入内容" required>
          <TextArea
            value={formData.input}
            onChange={(e) => handleInputChange('input', e.target.value)}
            placeholder="输入要发送给 Agent 的内容"
            rows={4}
          />
        </Form.Item>
        
        <Form.Item label="执行模式" required>
          <Radio.Group 
            value={formData.mode} 
            onChange={handleModeChange}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="sync">同步 (run_sync)</Radio.Button>
            <Radio.Button value="async">异步 (run)</Radio.Button>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item label="上下文 (可选)">
          <Input
            value={formData.context}
            onChange={(e) => handleInputChange('context', e.target.value)}
            placeholder="context=..."
          />
        </Form.Item>
      </Form>
      
      <Alert
        message={
          <Space direction="vertical" size={2}>
            <Text>提示: 确保将 Runner 连接到一个 Agent 节点，这样可以生成正确的执行代码。</Text>
            <Text>异步模式会生成带有 asyncio.run() 的代码。</Text>
          </Space>
        }
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default RunnerConfig;
