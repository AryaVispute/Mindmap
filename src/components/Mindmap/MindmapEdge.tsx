import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { useMindmapStore } from '@/store/mindmapStore';

export const MindmapEdge = ({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) => {
  const { selectedNodeId } = useMindmapStore();
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHighlighted = selectedNodeId === source || selectedNodeId === target;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        ...style,
        stroke: isHighlighted ? '#3b82f6' : '#94a3b8',
        strokeWidth: isHighlighted ? 3 : 2,
        transition: 'stroke 0.2s ease, strokeWidth 0.2s ease',
      }}
      markerEnd={markerEnd}
    />
  );
};

