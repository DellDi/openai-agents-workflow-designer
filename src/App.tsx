import { useCallback, useState } from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import { ClearOutlined, CodeOutlined, EyeOutlined, EyeInvisibleOutlined, AppstoreAddOutlined } from '@ant-design/icons';

import { useFlowStore } from '@/store/flowStore';
import { NodeTypes } from '@/types';
import Canvas from '@/components/Canvas';
import Sidebar from '@/components/Sidebar';
import ConfigPanel from '@/components/ConfigPanel';
import CodeGeneratorModal from '@/components/ConfigPanel/CodeGeneratorModal';
import GuideModal from '@/components/Modals/GuideModal';
import TemplateSelector from '@/components/Template/TemplateSelector';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const { 
    selectedNode,
    isCodeModalOpen,
    setIsCodeModalOpen,
    clearFlow
  } = useFlowStore();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeTypes;
      
      if (!type) {
        return;
      }

      const position = useFlowStore.getState().reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 };

      useFlowStore.getState().addNode(type, position);
    },
    [],
  );

  return (
    <Layout className="h-screen w-screen">
      {/* 顶部导航栏 */}
      <Header style={{ background: '#fff', padding: '0 16px', height: 64, lineHeight: '64px', borderBottom: '1px solid #f0f0f0' }}>
        <div className="flex items-center justify-between h-full">
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>OpenAI Agents 工作流设计器</Title>
          <Space>
            <Button 
              icon={<AppstoreAddOutlined />}
              onClick={() => setShowTemplateSelector(true)}
            >
              快速开始模板
            </Button>
            <Button 
              icon={showWelcome ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setShowWelcome(!showWelcome)}
            >
              {showWelcome ? '隐藏指南' : '显示指南'}
            </Button>
            <Button 
              danger
              icon={<ClearOutlined />}
              onClick={() => clearFlow()}
            >
              清空画布
            </Button>
            <Button 
              type="primary" 
              icon={<CodeOutlined />}
              onClick={() => setIsCodeModalOpen(true)}
            >
              生成代码
            </Button>
          </Space>
        </div>
      </Header>
      
      {/* 主内容区域 */}
      <Layout className="flex-1">
        <Sidebar />
        <Content className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
          <Canvas />
          {selectedNode && <ConfigPanel />}
          
          {/* 代码生成器对话框 */}
          <CodeGeneratorModal 
            visible={isCodeModalOpen}
            onClose={() => setIsCodeModalOpen(false)}
          />
          
          {/* 使用指南弹窗 */}
          <GuideModal 
            visible={showWelcome}
            onClose={() => setShowWelcome(false)}
          />
          
          {/* 模板选择弹窗 */}
          <TemplateSelector
            visible={showTemplateSelector}
            onClose={() => setShowTemplateSelector(false)}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
