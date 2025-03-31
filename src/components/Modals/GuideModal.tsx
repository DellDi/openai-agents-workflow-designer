import React from 'react';
import { Modal, Typography, Button, Tabs, Card, Row, Col, Tag } from 'antd';
import { 
  InfoCircleOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined,
  ToolOutlined,
  RobotOutlined,
  PlayCircleOutlined,
  SafetyOutlined,
  CodeOutlined
} from '@ant-design/icons';

const { Paragraph, Text } = Typography;
const { TabPane } = Tabs;

interface GuideModalProps {
  visible: boolean;  
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <div className="flex items-center text-blue-600">
          <InfoCircleOutlined className="mr-2 text-xl" />
          <span>OpenAI Agents 工作流设计器使用指南</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="ok" type="primary" onClick={onClose} icon={<CheckCircleOutlined />}>
          我知道了
        </Button>
      ]}
      maskClosable={false}
      bodyStyle={{ padding: '12px 24px', maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Typography>
        <Paragraph>
          欢迎使用 OpenAI Agents 工作流设计器！这个工具可以帮助你可视化设计多代理系统，并自动生成可执行的代码。
        </Paragraph>
        
        <Tabs defaultActiveKey="basic" type="card" size="small" className="mt-4">
          <TabPane tab="基本操作" key="basic">
            <Row gutter={[16, 16]} className="mt-2">
              <Col span={12}>
                <Card 
                  size="small" 
                  title={<Text strong><ArrowRightOutlined className="text-green-500 mr-2" />添加节点</Text>}
                  className="h-full"
                >
                  点击左侧的节点类型，然后拖动到画布上添加新节点
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={<Text strong><ArrowRightOutlined className="text-green-500 mr-2" />连接节点</Text>}
                  className="h-full"
                >
                  从一个节点的输出点拖拽到另一个节点的输入点，即可创建连接
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={<Text strong><ArrowRightOutlined className="text-green-500 mr-2" />编辑节点</Text>}
                  className="h-full"
                >
                  双击节点名称可以修改节点名称，点击展开/折叠箭头可以查看节点详情
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={<Text strong><ArrowRightOutlined className="text-green-500 mr-2" />删除节点</Text>}
                  className="h-full"
                >
                  选择节点后按 Delete 键可以删除节点
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="节点类型" key="nodes">
            <Row gutter={[16, 16]} className="mt-2">
              <Col span={12}>
                <Card 
                  size="small" 
                  title={
                    <Text strong>
                      <RobotOutlined className="text-blue-500 mr-2" />
                      代理节点 (Agent)
                    </Text>
                  }
                  className="h-full bg-blue-50"
                >
                  代表一个 AI 助手，可以处理任务、调用工具和转交给其他代理
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={
                    <Text strong>
                      <ToolOutlined className="text-orange-500 mr-2" />
                      函数工具 (Function Tool)
                    </Text>
                  }
                  className="h-full bg-orange-50"
                >
                  代表可供代理调用的函数，包含参数和返回值定义
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={
                    <Text strong>
                      <PlayCircleOutlined className="text-green-500 mr-2" />
                      执行器 (Runner)
                    </Text>
                  }
                  className="h-full bg-green-50"
                >
                  处理代理的执行环境和输入内容，可以选择同步或异步执行
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  size="small" 
                  title={
                    <Text strong>
                      <SafetyOutlined className="text-red-500 mr-2" />
                      防护节点 (Guardrail)
                    </Text>
                  }
                  className="h-full bg-red-50"
                >
                  用于设置安全限制和合规检查，确保代理行为在规定范围内
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="连接规则" key="rules">
            <div className="mt-2">
              <Paragraph>不同类型的节点遵循特定的连接规则：</Paragraph>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Tag color="success">Agent → Agent</Tag> 代理可以转交给其他代理
                </Col>
                <Col span={12}>
                  <Tag color="error">Agent → FunctionTool</Tag> 不允许（工具应该被代理调用）
                </Col>
                <Col span={12}>
                  <Tag color="success">FunctionTool → Agent</Tag> 函数工具可以被代理调用
                </Col>
                <Col span={12}>
                  <Tag color="success">Runner → Agent</Tag> 执行器可以启动代理
                </Col>
                <Col span={12}>
                  <Tag color="error">Agent → Runner</Tag> 不允许（应该从执行器到代理）
                </Col>
                <Col span={12}>
                  <Tag color="success">Guardrail → Agent</Tag> 防护节点可以应用于代理
                </Col>
              </Row>
            </div>
          </TabPane>
          
          <TabPane tab="代码生成" key="code">
            <div className="mt-2">
              <Card size="small">
                <div className="flex items-start">
                  <CodeOutlined className="text-purple-500 mr-3 text-xl mt-1" />
                  <div>
                    <Text strong>代码生成功能</Text>
                    <Paragraph className="mb-0 mt-1">
                      完成工作流设计后，点击右上角的"生成代码"按钮，即可获取对应的OpenAI Assistants API代码。
                      生成的代码包含完整的工作流逻辑，可以直接复制使用。
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Typography>
    </Modal>
  );
};

export default GuideModal;
