import { memo } from 'react';
import { BezierEdge, EdgeProps } from 'reactflow';

/**
 * 默认连线组件
 * 使用ReactFlow内置的BezierEdge组件，不做过多自定义
 */
const DefaultEdge = (props: EdgeProps) => {
  // 使用ReactFlow内置的BezierEdge组件，它会处理所有连线逻辑
  return <BezierEdge {...props} />;
};

export default memo(DefaultEdge);
