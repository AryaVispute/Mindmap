import { Node, Edge } from '@xyflow/react';
import { MindmapNode, NodeData } from '@/components/Mindmap/types';

export function parseMindmapData(
  data: MindmapNode,
  expandedNodes: Set<string>,
  depth: number = 0,
  parentId?: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const processNode = (node: MindmapNode, currentDepth: number, parent?: string) => {
    const nodeData: NodeData = {
      id: node.id,
      title: node.title,
      summary: node.summary,
      depth: currentDepth,
      parentId: parent,
      hasChildren: !!(node.children && node.children.length > 0),
    };

    nodes.push({
      id: node.id,
      type: 'mindmap',
      data: nodeData as unknown as Record<string, unknown>,
      position: { x: 0, y: 0 },
    });

    if (parent) {
      edges.push({
        id: `${parent}-${node.id}`,
        source: parent,
        target: node.id,
        type: 'smoothstep',
      });
    }

    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach((child) => {
        processNode(child, currentDepth + 1, node.id);
      });
    }
  };

  processNode(data, depth, parentId);

  return { nodes, edges };
}

