export interface MindmapNode {
  id: string;
  title: string;
  summary?: string;
  children?: MindmapNode[];
}

export interface NodeData {
  id: string;
  title: string;
  summary?: string;
  depth: number;
  parentId?: string;
  hasChildren: boolean;
}

export interface MindmapState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  hoveredNodeId: string | null;
  data: MindmapNode | null;
}

import { Node, Edge } from '@xyflow/react';

export type { Node, Edge };

