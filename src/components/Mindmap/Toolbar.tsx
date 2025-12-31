import { useState } from 'react';
import { 
  Expand, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Plus, 
  FileText, 
  Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMindmapStore } from '@/store/mindmapStore';
import { useReactFlow } from '@xyflow/react';
import { AddNodeDialog } from './AddNodeDialog';
import { FullDocumentationDialog } from './FullDocumentationDialog';

export const Toolbar = () => {
  const { expandAll, collapseAll, selectedNodeId, exportData } = useMindmapStore();
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);

  const handleFitView = () => {
    fitView({ duration: 500, padding: 0.2 });
  };

  const handleDownload = () => {
    const data = exportData();
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={expandAll}
            title="Expand All"
          >
            <Expand className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={collapseAll}
            title="Collapse All"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomIn({ duration: 300 })}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomOut({ duration: 300 })}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFitView}
            title="Fit View"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAddNodeOpen(true)}
            title="Add Node"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDocOpen(true)}
            title="Full Documentation"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            title="Download JSON"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        parentId={selectedNodeId}
      />
      <FullDocumentationDialog
        open={docOpen}
        onOpenChange={setDocOpen}
      />
    </>
  );
};

