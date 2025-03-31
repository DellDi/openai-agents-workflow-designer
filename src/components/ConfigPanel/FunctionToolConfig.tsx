import { useState } from 'react';
import { Form, Input, Select, Button, Typography, Space, Alert, Card, Row, Col } from 'antd';
import { ToolOutlined, PlusOutlined, DeleteOutlined, CodeOutlined } from '@ant-design/icons';
import { FlowNode, FunctionToolNodeData } from '@/types';
import { useFlowStore } from '@/store/flowStore';

interface FunctionToolConfigProps {
  node: FlowNode;
  data: FunctionToolNodeData;
}

const { TextArea } = Input;
const { Title, Text } = Typography;

const FunctionToolConfig = ({ node, data }: FunctionToolConfigProps) => {
  const { updateNodeData } = useFlowStore();
  const [formData, setFormData] = useState({
    name: data.name || '',
    parameters: data.parameters || [],
    returnType: data.returnType || 'str',
    implementation: data.implementation || '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { [name]: value });
  };

  const handleReturnTypeChange = (value: string) => {
    const returnType = value as FunctionToolNodeData['returnType'];
    setFormData((prev) => ({
      ...prev,
      returnType,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { returnType });
  };

  const addParameter = () => {
    const newParams = [...formData.parameters, { name: `param${formData.parameters.length + 1}`, type: 'str' }];
    setFormData((prev) => ({
      ...prev,
      parameters: newParams,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { parameters: newParams });
  };

  const removeParameter = (index: number) => {
    const newParams = formData.parameters.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      parameters: newParams,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { parameters: newParams });
  };

  const updateParameter = (index: number, key: 'name' | 'type', value: string) => {
    const newParams = [...formData.parameters];
    newParams[index] = { ...newParams[index], [key]: value };
    
    setFormData((prev) => ({
      ...prev,
      parameters: newParams,
    }));
    
    // 实时更新节点数据
    updateNodeData(node.id, { parameters: newParams });
  };

  const typeOptions = [
    { value: 'str', label: 'str' },
    { value: 'int', label: 'int' },
    { value: 'float', label: 'float' },
    { value: 'bool', label: 'bool' },
    { value: 'list', label: 'list' },
    { value: 'dict', label: 'dict' },
    { value: 'None', label: 'None' },
  ];

  return (
    <div>
      <Title level={5} style={{ color: '#f39c12', marginTop: 0, display: 'flex', alignItems: 'center' }}>
        <ToolOutlined style={{ marginRight: 8 }} /> Function Tool 设置
      </Title>
      
      <Form layout="vertical">
        <Form.Item label="函数名称" required>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="输入函数名称"
          />
        </Form.Item>
        
        <Form.Item label="函数参数">
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />} 
              onClick={addParameter}
              style={{ backgroundColor: '#f39c12', borderColor: '#f39c12' }}
            >
              添加参数
            </Button>
          </div>
          
          {formData.parameters.length === 0 ? (
            <Alert
              message={'暂无参数，点击添加参数按钮添加'}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {formData.parameters.map((param, index) => (
                <Card 
                  key={index} 
                  size="small" 
                  style={{ marginBottom: 8 }}
                  bodyStyle={{ padding: '8px 12px' }}
                >
                  <Row gutter={8} align="middle">
                    <Col flex="1">
                      <Input
                        value={param.name}
                        onChange={(e) => updateParameter(index, 'name', e.target.value)}
                        placeholder="参数名"
                        size="small"
                      />
                    </Col>
                    <Col span={8}>
                      <Select
                        value={param.type}
                        onChange={(value) => updateParameter(index, 'type', value)}
                        style={{ width: '100%' }}
                        size="small"
                      >
                        {typeOptions.map(option => (
                          <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => removeParameter(index)}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          )}
        </Form.Item>
        
        <Form.Item label="返回类型" required>
          <Select
            value={formData.returnType}
            onChange={handleReturnTypeChange}
            style={{ width: '100%' }}
          >
            {typeOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item label="函数实现" required>
          <TextArea
            value={formData.implementation}
            onChange={(e) => handleInputChange('implementation', e.target.value)}
            rows={6}
            placeholder="# 实现函数逻辑\nreturn 'Hello World'"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      </Form>
      
      <Alert
        message={
          <Space direction="vertical" size={2}>
            <Text>提示: 将此 Function 连接到 Agent 节点，使 Agent 能够使用这个工具函数。</Text>
            <Text>生成的代码将包含 @function_tool 装饰器。</Text>
          </Space>
        }
        type="info"
        icon={<CodeOutlined />}
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default FunctionToolConfig;
