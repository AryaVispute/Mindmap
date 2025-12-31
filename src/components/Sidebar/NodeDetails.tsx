import { useEffect, useState } from 'react';
import { useMindmapStore } from '@/store/mindmapStore';
import { NodeData } from '@/components/Mindmap/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const NodeDetails = () => {
  const { selectedNodeId, nodes, data, updateNodeData, deleteNode } = useMindmapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const nodeData = selectedNode?.data as unknown as NodeData;

  useEffect(() => {
    if (nodeData) {
      setTitle(nodeData.title);
      setSummary(nodeData.summary || '');
      setIsEditing(false);
    }
  }, [nodeData]);

  const handleSave = () => {
    if (selectedNodeId && nodeData && (title !== nodeData.title || summary !== (nodeData.summary || ''))) {
      updateNodeData(selectedNodeId, { title, summary: summary || undefined });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (nodeData) {
      setTitle(nodeData.title);
      setSummary(nodeData.summary || '');
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (selectedNodeId && data && selectedNodeId !== data.id) {
      deleteNode(selectedNodeId);
      setDeleteDialogOpen(false);
    }
  };

  const isRootNode = data && selectedNodeId === data.id;

  if (!selectedNode || !nodeData) {
    return (
      <div className="p-6 text-muted-foreground text-center">
        Select a node to view details
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs text-muted-foreground mb-2">Root</div>
        <h2 className="text-2xl font-bold text-primary mb-4">{nodeData.title}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">SUMMARY:</Label>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {nodeData.summary || 'No summary available'}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-border space-y-4">
        <div className="text-xs text-muted-foreground">
          <div>ID: <span className="text-foreground">{nodeData.id}</span></div>
          {nodeData.parentId && (
            <div>Parent: <span className="text-foreground">{nodeData.parentId}</span></div>
          )}
          <div>Depth: <span className="text-foreground">{nodeData.depth}</span></div>
        </div>
        
        {!isRootNode && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Node
          </Button>
        )}
        {isRootNode && (
          <p className="text-xs text-muted-foreground italic">
            Root node cannot be deleted
          </p>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{nodeData.title}"? This action cannot be undone and will also delete all child nodes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

