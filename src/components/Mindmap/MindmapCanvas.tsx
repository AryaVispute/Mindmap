import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MindmapNode } from './MindmapNode';
import { MindmapEdge } from './MindmapEdge';
import { Toolbar } from './Toolbar';
import { useMindmapStore } from '@/store/mindmapStore';
import { parseMindmapData } from '@/utils/dataParser';
import { calculateLayout } from '@/utils/layout';

const nodeTypes: NodeTypes = {
  mindmap: MindmapNode,
};

const edgeTypes: EdgeTypes = {
  smoothstep: MindmapEdge,
};

export const MindmapCanvas = () => {
  const {
    nodes,
    edges,
    expandedNodes,
    data,
    layoutSettings,
    setNodes,
    setEdges,
    setSelectedNodeId,
  } = useMindmapStore();

  const { fitView } = useReactFlow();

  const rebuildGraph = useCallback(() => {
    if (!data) return;

    const { nodes: parsedNodes, edges: parsedEdges } = parseMindmapData(
      data,
      expandedNodes
    );
    const layoutedNodes = calculateLayout(parsedNodes, parsedEdges, {
      horizontalSpacing: layoutSettings.horizontalSpacing,
      verticalSpacing: layoutSettings.verticalSpacing,
    });
    
    setNodes(layoutedNodes);
    setEdges(parsedEdges);
  }, [data, expandedNodes, layoutSettings, setNodes, setEdges]);

  useEffect(() => {
    rebuildGraph();
  }, [rebuildGraph]);

  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ duration: 500, padding: 0.2 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, fitView]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background patternColor="#334155" gap={20} />
        <Controls 
          position="bottom-left"
          showZoom={true}
          showFitView={false}
          showInteractive={false}
        />
        <MiniMap
          className="bg-background/80 border border-border rounded-lg"
          nodeColor={(node) => {
            const depth = (node.data as any)?.depth || 0;
            const colors = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899'];
            return colors[Math.min(depth, colors.length - 1)];
          }}
          position="bottom-right"
        />
        <Toolbar />
      </ReactFlow>
    </div>
  );
};

