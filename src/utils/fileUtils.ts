/**
 * 文件操作相关工具函数
 */

// 将生成的代码保存为文件（前端环境下可通过文件下载方式实现）
export const saveCodeToFile = (code: string, filename: string = 'openai_agent_workflow.py') => {
  // 创建blob对象
  const blob = new Blob([code], { type: 'text/plain' });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 触发点击事件下载文件
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};

// 格式化Python代码
export const formatPythonCode = (code: string): string => {
  // 简单格式化，实际项目可集成更复杂的格式化库
  const lines = code.split('\n');
  let formattedCode = '';
  let indentLevel = 0;
  
  for (let line of lines) {
    const trimmedLine = line.trim();
    
    // 减少缩进级别的情况
    if (trimmedLine.startsWith('}') || 
        trimmedLine.startsWith(')') || 
        trimmedLine.startsWith(']') ||
        trimmedLine === 'else:' ||
        trimmedLine === 'elif:' ||
        trimmedLine.startsWith('except') ||
        trimmedLine === 'finally:') {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // 添加当前行（带缩进）
    if (trimmedLine.length > 0) {
      formattedCode += '    '.repeat(indentLevel) + trimmedLine + '\n';
    } else {
      formattedCode += '\n'; // 保留空行但不缩进
    }
    
    // 增加缩进级别的情况
    if (trimmedLine.endsWith(':') || 
        trimmedLine.endsWith('{') || 
        trimmedLine.endsWith('(') || 
        trimmedLine.endsWith('[')) {
      indentLevel += 1;
    }
  }
  
  return formattedCode;
};
