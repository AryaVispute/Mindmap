import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMindmapStore } from '@/store/mindmapStore';
import { MindmapNode } from './types';

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
}

export const AddNodeDialog = ({ open, onOpenChange, parentId }: AddNodeDialogProps) => {
  const { addNode, selectedNodeId, data } = useMindmapStore();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetParentId = parentId || selectedNodeId;
    if (!targetParentId && data) {
      targetParentId = data.id;
    }
    if (!targetParentId) return;

    const newNode: MindmapNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      summary: summary.trim() || undefined,
    };

    addNode(targetParentId, newNode);
    setTitle('');
    setSummary('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setSummary('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
          <DialogDescription>
            Create a new child node {selectedNodeId ? `under the selected node` : 'at the root level'}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="node-title">Title *</Label>
              <Input
                id="node-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter node title"
                className="mt-1"
                autoFocus
                required
              />
            </div>
            <div>
              <Label htmlFor="node-summary">Summary</Label>
              <Textarea
                id="node-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter node summary (optional)"
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

