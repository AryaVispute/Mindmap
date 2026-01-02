# Interactive Mindmap UI - Assignment Solution

## Solution Description

### Technologies Used

- **React 18** - Modern UI library for building interactive components
- **TypeScript** - Type-safe JavaScript for better code quality and maintainability
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Zustand** - Lightweight state management library (minimal boilerplate)

### Libraries Used

1. **@xyflow/react (React Flow)** - Graph visualization library
   - **Why**: Provides robust node/edge rendering, layout management, and interaction handling
   - Handles complex graph operations like zoom, pan, and node positioning

2. **shadcn/ui** - Component library built on Radix UI
   - **Why**: Accessible, customizable components (Dialog, Button, Input, etc.)
   - Provides consistent design system

3. **lucide-react** - Icon library
   - **Why**: Modern, consistent icon set for UI controls

4. **zustand** - State management
   - **Why**: Simpler than Redux, no boilerplate, perfect for this use case

### Overall Architecture

The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Data Layer (JSON)             │
│         src/data/mindmap.json           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        State Management Layer           │
│      Zustand Store (mindmapStore)       │
│  - Manages nodes, edges, selection      │
│  - Handles expand/collapse state        │
│  - Updates trigger UI re-renders        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  - dataParser.ts: JSON → Graph          │
│  - layout.ts: Position calculation      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  - MindmapCanvas: Main graph view       │
│  - MindmapNode: Individual nodes        │
│  - Sidebar: Node details panel          │
│  - Toolbar: Control buttons             │
└─────────────────────────────────────────┘
```

### How Data Flows from JSON to UI

1. **Data Loading** (`App.tsx`)
   ```typescript
   // JSON file is imported and loaded into Zustand store
   import mindmapData from './data/mindmap.json';
   setData(mindmapData);
   ```

2. **Data Parsing** (`dataParser.ts`)
   ```typescript
   // Recursive function converts hierarchical JSON to flat arrays
   parseMindmapData(data, expandedNodes)
   // Returns: { nodes: Node[], edges: Edge[] }
   ```

3. **Layout Calculation** (`layout.ts`)
   ```typescript
   // Calculates x,y positions for each node
   calculateLayout(nodes, edges)
   // Returns: Node[] with position coordinates
   ```

4. **State Update** (`mindmapStore.ts`)
   ```typescript
   // Zustand store updates trigger React re-renders
   setNodes(layoutedNodes);
   setEdges(parsedEdges);
   ```

5. **UI Rendering** (`MindmapCanvas.tsx`)
   ```typescript
   // React Flow renders the graph
   <ReactFlow nodes={nodes} edges={edges} />
   ```

**Key Point**: Changing `mindmap.json` automatically updates the UI because:
- Store watches `data` changes
- `useEffect` triggers graph rebuild
- React Flow re-renders with new nodes/edges

### Project Structure

```
src/
├── components/
│   ├── Mindmap/
│   │   ├── MindmapCanvas.tsx    # Main graph canvas
│   │   ├── MindmapNode.tsx      # Custom node with interactions
│   │   ├── MindmapEdge.tsx      # Custom edge with highlighting
│   │   ├── Toolbar.tsx          # Top control bar
│   │   ├── AddNodeDialog.tsx    # Add node modal
│   │   ├── FullDocumentationDialog.tsx  # Full tree view
│   │   └── types.ts             # TypeScript definitions
│   ├── Sidebar/
│   │   ├── Sidebar.tsx          # Right panel container
│   │   └── NodeDetails.tsx      # Node info & editing
│   └── ui/                      # shadcn/ui components
├── data/
│   └── mindmap.json             # ⭐ Data source (change this to update UI)
├── store/
│   └── mindmapStore.ts          # Global state management
├── utils/
│   ├── layout.ts                # Graph layout algorithm
│   └── dataParser.ts            # JSON → Graph converter
├── App.tsx                      # Root component
└── main.tsx                     # Entry point
```

## Features Implemented

### ✅ Mandatory Requirements

1. **Mindmap Visualization**
   - ✅ Graph structure with nodes and connections
   - ✅ Hierarchical parent → child relationships
   - ✅ Clear, readable layout (hierarchical left-to-right)

2. **Interactive Features**
   - ✅ **Hover interactions**: Shows tooltip with summary
   - ✅ **Click interactions**: 
     - Click node to select and expand/collapse children
     - Click handles to add child nodes
   - ✅ **Highlight related nodes/edges**: 
     - Selected node highlighted with ring
     - Related nodes (parent/children) highlighted
     - Connected edges highlighted in blue
   - ✅ **Fit to View / Reset View**: Toolbar button
   - ✅ **Edit nodes**: Edit title and summary in sidebar

3. **Data Display**
   - ✅ **On hover**: Tooltip with node title and summary
   - ✅ **Side panel**: Detailed node information with metadata

4. **Data-Driven Rendering** ⭐
   - ✅ Entire visualization generated from `src/data/mindmap.json`
   - ✅ Changing JSON updates UI automatically
   - ✅ No hardcoded nodes or structure

### ✅ Bonus Features

- ✅ Export/Download functionality (JSON export)
- ✅ Add node functionality
- ✅ Delete node functionality
- ✅ Full documentation view
- ✅ Expand All / Collapse All
- ✅ Zoom controls
- ✅ MiniMap for navigation

## Usage

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Modify the mindmap**:
   - Edit `src/data/mindmap.json` to change structure
   - UI updates automatically on save

## Data Format

The JSON structure supports unlimited nesting:

```json
{
  "id": "root",
  "title": "Node Title",
  "summary": "Optional description",
  "children": [
    {
      "id": "child-1",
      "title": "Child Node",
      "summary": "Child description",
      "children": [...]
    }
  ]
}
```

## Key Design Decisions

1. **Zustand over Redux**: Simpler API, less boilerplate
2. **React Flow**: Industry-standard graph library, handles complex interactions
3. **Hierarchical Layout**: Left-to-right flow matches mental model
4. **Color-coded by Depth**: Visual hierarchy aids understanding
5. **Static Handles**: Connection points don't move with node transforms

## Testing the Data-Driven Feature

To verify data-driven rendering works:

1. Open `src/data/mindmap.json`
2. Add a new node to any `children` array
3. Save the file
4. UI automatically updates with new node

**Example**:
```json
{
  "id": "new-node",
  "title": "New Node",
  "summary": "This was added via JSON"
}
```

## Submission Checklist

- ✅ Source code (complete)
- ✅ Data file (`src/data/mindmap.json`)
- ✅ README (this file)
- ⏳ Screenshots (to be provided)
- ⏳ Demo Video (to be provided)

