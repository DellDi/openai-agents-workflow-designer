import { useState } from 'react';
import { Form, Input, Typography, Space, Alert } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { FlowNode, GuardrailNodeData } from '@/types';
import { useFlowStore } from '@/store/flowStore';

interface GuardrailConfigProps {
  node: FlowNode;
  data: GuardrailNodeData;
}

const { Title, Text } = Typography;

const GuardrailConfig = ({ node, data }: GuardrailConfigProps) => {
  const { updateNodeData } = useFlowStore();
  const [formData, setFormData] = useState({
    name: data.name || '',
    output_model: data.output_model || '',
    guardrail_function: data.guardrail_function || '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 实时更新节点数据
    updateNodeData(node.id, { [name]: value });
  };

  return (
    <div>
      <Title level={5} style={{ color: '#9b59b6', marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <SafetyOutlined style={{ marginRight: 8 }} /> Guardrail 守护墙设置
      </Title>

      <Form layout="vertical">
        <Form.Item label="名称" required>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="输入守护墙名称"
          />
        </Form.Item>

        <Form.Item
          label="输出模型 (Pydantic)"
          required
          help="这将生成一个 Pydantic BaseModel 类"
        >
          <Input
            value={formData.output_model}
            onChange={(e) => handleInputChange('output_model', e.target.value)}
            placeholder="如: HomeworkOutput"
          />
        </Form.Item>

        <Form.Item
          label="守护函数名称"
          required
          help="用于创建 InputGuardrail 的异步函数"
        >
          <Input
            value={formData.guardrail_function}
            onChange={(e) => handleInputChange('guardrail_function', e.target.value)}
            placeholder="如: homework_guardrail"
          />
        </Form.Item>
      </Form>

      <Alert
        message={
          <Space direction="vertical" size={2}>
            <Text>提示: 将此 Guardrail 连接到 Agent 节点，创建输入守护规则。</Text>
            <Text>生成的代码将包含 Pydantic 模型定义和守护函数实现。</Text>
          </Space>
        }
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default GuardrailConfig;
