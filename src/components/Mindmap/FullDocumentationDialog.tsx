import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMindmapStore } from '@/store/mindmapStore';
import { MindmapNode } from './types';

interface FullDocumentationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const renderNode = (node: MindmapNode, depth: number = 0): JSX.Element => {
  const indent = depth * 24;
  
  return (
    <div key={node.id} className="mb-4">
      <div style={{ paddingLeft: `${indent}px` }}>
        <h3 className="text-lg font-bold text-primary mb-1">{node.title}</h3>
        {node.summary && (
          <p className="text-sm text-muted-foreground mb-2">{node.summary}</p>
        )}
        <div className="text-xs text-muted-foreground mb-3">
          ID: {node.id} | Depth: {depth}
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="ml-4 border-l-2 border-border pl-4">
          {node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );
};

export const FullDocumentationDialog = ({ open, onOpenChange }: FullDocumentationDialogProps) => {
  const { data } = useMindmapStore();

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Full Documentation</DialogTitle>
          <DialogDescription>
            Complete hierarchical view of all nodes in the mindmap
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="py-4">
            {renderNode(data)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

