import { memo } from 'react';
import { Typography, Card, Row, Col, Modal } from 'antd';
import { 
  RobotOutlined, 
  TeamOutlined, 
  ToolOutlined 
} from '@ant-design/icons';
import { useFlowStore } from '@/store/flowStore';
import { loadTemplate } from '@/utils/templates';

const { Title, Text } = Typography;

interface TemplateSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ visible, onClose }) => {
  const { loadTemplateFlow } = useFlowStore();
  
  const handleTemplateSelect = (templateId: 'basic' | 'multiAgent' | 'functionTool') => {
    const { nodes, edges } = loadTemplate(templateId);
    loadTemplateFlow(nodes, edges);
    onClose(); // 选择模板后关闭弹窗
  };

  const templates = [
    {
      id: 'basic',
      title: '基础 Agent',
      description: '包含一个基本的Agent和Runner设置',
      icon: <RobotOutlined />,
      color: '#1677ff',
      bgColor: '#e6f4ff',
    },
    {
      id: 'multiAgent',
      title: '多 Agent 协作',
      description: '包含三个Agent的协作工作流，支持语言分流',
      icon: <TeamOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      id: 'functionTool',
      title: 'Function Tool 示例',
      description: '包含带工具函数的Agent示例',
      icon: <ToolOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6',
    }
  ];
  
  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>快速开始模板</Title>}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={null}
      destroyOnClose
    >
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {templates.map(template => (
          <Col span={24} key={template.id}>
            <Card
              hoverable
              style={{ 
                backgroundColor: template.bgColor,
                borderColor: template.color
              }}
              bodyStyle={{ padding: 16 }}
              onClick={() => handleTemplateSelect(template.id as 'basic' | 'multiAgent' | 'functionTool')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    fontSize: 24, 
                    color: template.color, 
                    marginRight: 12 
                  }}
                >
                  {template.icon}
                </div>
                <div>
                  <Text strong style={{ fontSize: 16, color: template.color }}>
                    {template.title}
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {template.description}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default memo(TemplateSelector);
