import { useState } from 'react';
import { NodeDetails } from './NodeDetails';
import { Settings } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';

export const Sidebar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="w-96 bg-secondary/50 border-l border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Architecture Documentation</h1>
              <p className="text-sm text-muted-foreground">Interactive component visualization</p>
            </div>
            <button 
              className="p-2 rounded-full hover:bg-accent transition-colors"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NodeDetails />
        </div>
      </div>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
};

