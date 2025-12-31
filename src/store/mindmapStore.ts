import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { MindmapNode, NodeData } from '@/components/Mindmap/types';

interface LayoutSettings {
  horizontalSpacing: number;
  verticalSpacing: number;
}

interface MindmapStore {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
  hoveredNodeId: string | null;
  data: MindmapNode | null;
  layoutSettings: LayoutSettings;
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setData: (data: MindmapNode) => void;
  updateNodeData: (id: string, updates: Partial<NodeData>) => void;
  addNode: (parentId: string, newNode: MindmapNode) => void;
  deleteNode: (id: string) => void;
  exportData: () => string;
  updateLayoutSettings: (settings: Partial<LayoutSettings>) => void;
}

export const useMindmapStore = create<MindmapStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  expandedNodes: new Set<string>(),
  hoveredNodeId: null,
  data: null,
  layoutSettings: {
    horizontalSpacing: 350,
    verticalSpacing: 200,
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  
  toggleExpanded: (id) => set((state) => {
    const newExpanded = new Set(state.expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    return { expandedNodes: newExpanded };
  }),

  expandAll: () => {
    const { data } = get();
    if (!data) return;
    
    const allIds = new Set<string>();
    const collectIds = (node: MindmapNode) => {
      allIds.add(node.id);
      node.children?.forEach(collectIds);
    };
    collectIds(data);
    
    set({ expandedNodes: allIds });
  },

  collapseAll: () => {
    const { data } = get();
    if (!data) return;
    set({ expandedNodes: new Set([data.id]) });
  },

  setData: (data) => set({ data, expandedNodes: new Set([data.id]) }),

  updateNodeData: (id, updates) => {
    const { data } = get();
    if (!data) return;

    const updateNode = (node: MindmapNode): MindmapNode => {
      if (node.id === id) {
        return { ...node, title: updates.title || node.title, summary: updates.summary ?? node.summary };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };

    const updatedData = updateNode(data);
    set({ data: updatedData });
  },

  addNode: (parentId, newNode) => {
    const { data, expandedNodes } = get();
    if (!data) return;

    const addNodeToTree = (node: MindmapNode): MindmapNode => {
      if (node.id === parentId) {
        const children = node.children || [];
        return {
          ...node,
          children: [...children, newNode],
        };
      }
      if (node.children) {
        return { ...node, children: node.children.map(addNodeToTree) };
      }
      return node;
    };

    const updatedData = addNodeToTree(data);
    const newExpanded = new Set(expandedNodes);
    newExpanded.add(parentId);
    newExpanded.add(newNode.id);
    
    set({ data: updatedData, expandedNodes: newExpanded, selectedNodeId: newNode.id });
  },

  deleteNode: (id) => {
    const { data } = get();
    if (!data) return;
    
    // Prevent deleting root node
    if (data.id === id) return;

    const deleteNodeFromTree = (node: MindmapNode): MindmapNode | null => {
      // If this is the node to delete, return null to remove it
      if (node.id === id) {
        return null;
      }
      
      // If node has children, filter out the deleted one
      if (node.children) {
        const filteredChildren = node.children
          .map(deleteNodeFromTree)
          .filter((child): child is MindmapNode => child !== null);
        
        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined,
        };
      }
      
      return node;
    };

    const updatedData = deleteNodeFromTree(data);
    if (updatedData) {
      set({ 
        data: updatedData, 
        selectedNodeId: null,
        expandedNodes: new Set([updatedData.id]),
      });
    }
  },

  exportData: () => {
    const { data } = get();
    if (!data) return '';
    return JSON.stringify(data, null, 2);
  },

  updateLayoutSettings: (settings) => {
    set((state) => ({
      layoutSettings: { ...state.layoutSettings, ...settings },
    }));
  },
}));

