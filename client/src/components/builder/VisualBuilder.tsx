import { useState } from 'react';
import { ArrowLeft, Save, Eye, Settings, Layers, Database, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface VisualBuilderProps {
  projectId: number;
  onBack: () => void;
}

interface Component {
  id: string;
  type: string;
  name: string;
  icon: any;
  category: string;
}

const componentLibrary: Component[] = [
  { id: 'header', type: 'header', name: 'Header', icon: Layers, category: 'Layout' },
  { id: 'form', type: 'form', name: 'Form', icon: Database, category: 'Data' },
  { id: 'table', type: 'table', name: 'Data Table', icon: Database, category: 'Data' },
  { id: 'chart', type: 'chart', name: 'Chart', icon: Palette, category: 'Visualization' },
];

export function VisualBuilder({ projectId, onBack }: VisualBuilderProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [canvasComponents, setCanvasComponents] = useState<any[]>([]);

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = JSON.parse(e.dataTransfer.getData('component'));
    const newComponent = {
      ...componentData,
      id: `${componentData.type}_${Date.now()}`,
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top,
    };
    setCanvasComponents(prev => [...prev, newComponent]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                Visual Builder
              </h1>
              <p className="text-sm text-slate-500">Project ID: {projectId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Component Library Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <Tabs defaultValue="components" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-slate-900 dark:text-white">Layout</h3>
                <div className="space-y-2">
                  {componentLibrary.filter(c => c.category === 'Layout').map((component) => (
                    <Card
                      key={component.id}
                      className="cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                    >
                      <CardContent className="p-3 flex items-center space-x-3">
                        <component.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">{component.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-slate-900 dark:text-white">Data</h3>
                <div className="space-y-2">
                  {componentLibrary.filter(c => c.category === 'Data').map((component) => (
                    <Card
                      key={component.id}
                      className="cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                    >
                      <CardContent className="p-3 flex items-center space-x-3">
                        <component.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">{component.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-slate-900 dark:text-white">Visualization</h3>
                <div className="space-y-2">
                  {componentLibrary.filter(c => c.category === 'Visualization').map((component) => (
                    <Card
                      key={component.id}
                      className="cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-slate-700"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                    >
                      <CardContent className="p-3 flex items-center space-x-3">
                        <component.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">{component.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="p-4">
              {selectedComponent ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Properties</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Component ID
                      </label>
                      <div className="mt-1 text-sm text-slate-500">{selectedComponent}</div>
                    </div>
                    {/* Property controls would be dynamically generated based on component type */}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 mt-8">
                  Select a component to edit properties
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline">Desktop View</Badge>
                <span className="text-sm text-slate-500">
                  {canvasComponents.length} component{canvasComponents.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="flex-1 bg-white dark:bg-slate-900 relative overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {canvasComponents.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Start Building Your App
                  </h3>
                  <p className="text-slate-500">
                    Drag components from the sidebar to begin designing your interface
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {canvasComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`absolute border-2 border-dashed border-blue-300 p-4 rounded cursor-pointer ${
                      selectedComponent === component.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    style={{ left: component.x, top: component.y }}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <component.icon className="w-5 h-5 text-slate-600" />
                      <span className="font-medium">{component.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}