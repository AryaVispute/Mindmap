import { Node, Edge } from '@xyflow/react';
import { NodeData } from '@/components/Mindmap/types';

interface LayoutOptions {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
}

const defaultOptions: LayoutOptions = {
  nodeWidth: 200,
  nodeHeight: 120, // Increased to account for text wrapping
  horizontalSpacing: 350,
  verticalSpacing: 200, // Increased spacing to prevent overlap
};

export function calculateLayout(
  nodes: Node[],
  _edges: Edge[],
  options: Partial<LayoutOptions> = {}
): Node[] {
  const opts = { ...defaultOptions, ...options };
  const nodeMap = new Map<string, Node>();
  const childrenMap = new Map<string, Node[]>();
  const rootNodes: Node[] = [];

  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    const nodeData = node.data as unknown as NodeData;
    
    if (!nodeData.parentId) {
      rootNodes.push(node);
    } else {
      if (!childrenMap.has(nodeData.parentId)) {
        childrenMap.set(nodeData.parentId, []);
      }
      childrenMap.get(nodeData.parentId)!.push(node);
    }
  });

  const layoutedNodes: Node[] = [];

  // Calculate the total height needed for a subtree
  const calculateSubtreeHeight = (nodeId: string): number => {
    const children = childrenMap.get(nodeId) || [];
    if (children.length === 0) {
      return opts.nodeHeight;
    }
    
    let totalHeight = 0;
    children.forEach((child) => {
      totalHeight += calculateSubtreeHeight(child.id);
    });
    totalHeight += (children.length - 1) * opts.verticalSpacing;
    
    return Math.max(totalHeight, opts.nodeHeight);
  };

  const layoutNode = (node: Node, x: number, y: number, depth: number): number => {
    const children = childrenMap.get(node.id) || [];
    
    layoutedNodes.push({
      ...node,
      position: { x, y },
    });

    if (children.length === 0) return y;

    // Calculate total height needed for all children
    let totalChildrenHeight = 0;
    const childHeights: number[] = [];
    
    children.forEach((child) => {
      const height = calculateSubtreeHeight(child.id);
      childHeights.push(height);
      totalChildrenHeight += height;
    });
    
    // Add spacing between children
    totalChildrenHeight += (children.length - 1) * opts.verticalSpacing;

    // Start positioning from top
    let currentY = y - totalChildrenHeight / 2;

    children.forEach((child, index) => {
      const childHeight = childHeights[index];
      const childX = x + opts.horizontalSpacing;
      const childY = currentY + childHeight / 2;
      
      layoutNode(child, childX, childY, depth + 1);
      
      // Move to next child position
      currentY += childHeight + opts.verticalSpacing;
    });

    return y;
  };

  if (rootNodes.length > 0) {
    const root = rootNodes[0];
    layoutNode(root, 400, 400, 0);
  }

  return layoutedNodes;
}

export function getNodeColor(depth: number): string {
  const colors = [
    'bg-blue-500',      // depth 0 - root
    'bg-green-500',     // depth 1
    'bg-orange-500',    // depth 2
    'bg-purple-500',    // depth 3
    'bg-pink-500',      // depth 4+
  ];
  return colors[Math.min(depth, colors.length - 1)];
}

