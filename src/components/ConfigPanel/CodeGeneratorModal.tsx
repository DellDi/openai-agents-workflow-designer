import { Editor } from '@monaco-editor/react';
import { Modal, Button, message, Space, Typography } from 'antd';
import { CopyOutlined, CloseOutlined } from '@ant-design/icons';
import { useFlowStore } from '@/store/flowStore';

const { Title } = Typography;

interface CodeGeneratorModalProps {
  visible?: boolean;
  onClose?: () => void;
}

const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({ visible, onClose }) => {
  const { generatedCode, setIsCodeModalOpen, isCodeModalOpen } = useFlowStore();
  
  // 使用props或store中的状态
  const isOpen = visible !== undefined ? visible : isCodeModalOpen;
  
  // 复制代码到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    message.success('代码已复制到剪贴板');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsCodeModalOpen(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>生成的 OpenAI Agents 代码</Title>}
      open={isOpen}
      onCancel={handleClose}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, height: 'calc(80vh - 110px)' }}
      footer={[
        <Space key="footer">
          <Button 
            type="primary" 
            icon={<CopyOutlined />} 
            onClick={copyToClipboard}
          >
            复制代码
          </Button>
          <Button 
            icon={<CloseOutlined />} 
            onClick={handleClose}
          >
            关闭
          </Button>
        </Space>
      ]}
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={generatedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
    </Modal>
  );
};

export default CodeGeneratorModal;
