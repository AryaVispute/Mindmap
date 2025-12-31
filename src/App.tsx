import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapCanvas } from './components/Mindmap/MindmapCanvas';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Loader } from './components/Loader';
import { useMindmapStore } from './store/mindmapStore';
import mindmapData from './data/mindmap.json';
import { MindmapNode } from './components/Mindmap/types';

function App() {
  const { setData, expandAll } = useMindmapStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData(mindmapData as MindmapNode);
    setTimeout(() => expandAll(), 100);
    
    // Keep loader visible for 4 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [setData, expandAll]);

  return (
    <ReactFlowProvider>
      {isLoading && <Loader />}
      <div className="w-screen h-screen flex bg-background">
        <div className="flex-1 relative">
          <MindmapCanvas />
        </div>
        <Sidebar />
      </div>
    </ReactFlowProvider>
  );
}

export default App;

