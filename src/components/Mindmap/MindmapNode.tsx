import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeData } from './types';
import { getNodeColor } from '@/utils/layout';
import { useMindmapStore } from '@/store/mindmapStore';
import { AddNodeDialog } from './AddNodeDialog';

export const MindmapNode = memo(({ data, selected, id }: NodeProps) => {
  const { setSelectedNodeId, setHoveredNodeId, hoveredNodeId, toggleExpanded, selectedNodeId, nodes } = useMindmapStore();
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const nodeData = data as unknown as NodeData;
  const { title, depth, hasChildren, summary, parentId } = nodeData;
  const colorClass = getNodeColor(depth);
  const isHovered = hoveredNodeId === nodeData.id;
  const isSelected = selected;
  
  // Check if this node is related to the selected node
  const isRelated = selectedNodeId ? (() => {
    if (selectedNodeId === id) return true;
    if (selectedNodeId === parentId) return true;
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedNodeData = selectedNode?.data as NodeData | undefined;
    if (selectedNodeData?.parentId === id) return true;
    return false;
  })() : false;

  const handleClick = () => {
    setSelectedNodeId(nodeData.id);
    if (hasChildren) {
      toggleExpanded(nodeData.id);
    }
  };

  const handleHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(nodeData.id);
    setAddNodeOpen(true);
  };

  const handleMouseEnter = () => {
    setHoveredNodeId(nodeData.id);
  };

  const handleMouseLeave = () => {
    setHoveredNodeId(null);
  };

  return (
    <>
      <div className="relative" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
        {isHovered && summary && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-50 bg-background/95 border border-border rounded-lg p-3 shadow-xl max-w-xs pointer-events-none">
            <div className="text-xs font-semibold text-foreground mb-1">{title}</div>
            <div className="text-xs text-muted-foreground line-clamp-3">{summary}</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/95"></div>
          </div>
        )}
        <div
          className={`relative ${colorClass} rounded-full px-6 py-4 min-w-[150px] text-center cursor-pointer transition-all duration-200 ${
            isSelected ? 'ring-4 ring-blue-400 ring-offset-2' : ''
          } ${isRelated && !isSelected ? 'ring-2 ring-blue-300 ring-offset-1 opacity-90' : ''} ${
            isHovered ? 'shadow-2xl' : 'shadow-lg'
          }`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {depth > 0 && (
            <div className="handle-wrapper" style={{ position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
              <Handle
                type="target"
                position={Position.Left}
                className="static-handle"
                onClick={handleHandleClick}
                title="Click to add child node"
                style={{ transform: 'none' }}
              />
            </div>
          )}
          <div className="font-bold text-white text-sm leading-tight">
            {title.split(' ').map((word: string, i: number) => (
              <div key={i}>{word}</div>
            ))}
          </div>
          {hasChildren && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              ▼
            </div>
          )}
          <div className="handle-wrapper" style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
            <Handle
              type="source"
              position={Position.Right}
              className="static-handle"
              onClick={handleHandleClick}
              title="Click to add child node"
              style={{ transform: 'none' }}
            />
          </div>
        </div>
      </div>
      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        parentId={nodeData.id}
      />
    </>
  );
});

MindmapNode.displayName = 'MindmapNode';

