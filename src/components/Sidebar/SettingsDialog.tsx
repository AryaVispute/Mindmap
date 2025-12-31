import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMindmapStore } from '@/store/mindmapStore';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { data, layoutSettings, updateLayoutSettings } = useMindmapStore();
  const [horizontalSpacing, setHorizontalSpacing] = useState(layoutSettings.horizontalSpacing);
  const [verticalSpacing, setVerticalSpacing] = useState(layoutSettings.verticalSpacing);

  useEffect(() => {
    if (open) {
      setHorizontalSpacing(layoutSettings.horizontalSpacing);
      setVerticalSpacing(layoutSettings.verticalSpacing);
    }
  }, [open, layoutSettings]);

  const handleReset = () => {
    setHorizontalSpacing(350);
    setVerticalSpacing(200);
    updateLayoutSettings({
      horizontalSpacing: 350,
      verticalSpacing: 200,
    });
  };

  const handleApply = () => {
    updateLayoutSettings({
      horizontalSpacing,
      verticalSpacing,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure mindmap visualization preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="horizontal-spacing">Horizontal Spacing</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="horizontal-spacing"
                  type="number"
                  value={horizontalSpacing}
                  onChange={(e) => setHorizontalSpacing(Number(e.target.value))}
                  min={100}
                  max={1000}
                  step={50}
                />
                <span className="text-sm text-muted-foreground">px</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Distance between parent and child nodes
              </p>
            </div>

            <div>
              <Label htmlFor="vertical-spacing">Vertical Spacing</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="vertical-spacing"
                  type="number"
                  value={verticalSpacing}
                  onChange={(e) => setVerticalSpacing(Number(e.target.value))}
                  min={100}
                  max={500}
                  step={50}
                />
                <span className="text-sm text-muted-foreground">px</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Distance between sibling nodes
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Current Mindmap:</p>
              <div className="space-y-1 text-xs">
                <div>Total Nodes: {data ? (() => {
                  const countNodes = (node: any): number => {
                    let count = 1;
                    if (node.children) {
                      node.children.forEach((child: any) => {
                        count += countNodes(child);
                      });
                    }
                    return count;
                  };
                  return countNodes(data);
                })() : 0}</div>
                <div>Root: {data?.title || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

