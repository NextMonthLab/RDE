import { useState } from 'react';
import { ArrowLeft, Save, Plus, Database, BarChart3, Users, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminPanelBuilderProps {
  projectId: number;
  onBack: () => void;
}

interface PanelSection {
  id: string;
  type: 'dashboard' | 'form' | 'table' | 'analytics';
  title: string;
  config: any;
}

export function AdminPanelBuilder({ projectId, onBack }: AdminPanelBuilderProps) {
  const [sections, setSections] = useState<PanelSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const sectionTypes = [
    { value: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { value: 'form', label: 'Data Entry Form', icon: FileText },
    { value: 'table', label: 'Data Table', icon: Database },
    { value: 'analytics', label: 'Analytics Panel', icon: BarChart3 },
  ];

  const addSection = (type: string) => {
    const newSection: PanelSection = {
      id: `section_${Date.now()}`,
      type: type as any,
      title: `New ${type}`,
      config: {},
    };
    setSections(prev => [...prev, newSection]);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<PanelSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const selectedSectionData = sections.find(s => s.id === selectedSection);

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
                Admin Panel Builder
              </h1>
              <p className="text-sm text-slate-500">Project ID: {projectId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Panel
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sections Sidebar */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900 dark:text-white">Panel Sections</h3>
              <Select onValueChange={addSection}>
                <SelectTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {sections.map((section) => {
                const SectionIcon = sectionTypes.find(t => t.value === section.type)?.icon || Database;
                return (
                  <Card
                    key={section.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSection === section.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <CardContent className="p-3 flex items-center space-x-3">
                      <SectionIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{section.title}</div>
                        <div className="text-xs text-slate-500 capitalize">{section.type}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {sections.length === 0 && (
              <div className="text-center text-slate-500 mt-8">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No sections yet</p>
                <p className="text-xs">Add your first section to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedSectionData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 w-fit">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex-1 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Section Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Section Title</Label>
                      <Input
                        id="title"
                        value={selectedSectionData.title}
                        onChange={(e) => updateSection(selectedSectionData.id, { title: e.target.value })}
                        placeholder="Enter section title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Section Type</Label>
                      <Select
                        value={selectedSectionData.type}
                        onValueChange={(value) => updateSection(selectedSectionData.id, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Section Preview</h4>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-800">
                        <div className="text-slate-600 dark:text-slate-400">
                          {selectedSectionData.type === 'dashboard' && 'Dashboard widgets and metrics will appear here'}
                          {selectedSectionData.type === 'form' && 'Form fields and controls will appear here'}
                          {selectedSectionData.type === 'table' && 'Data table with rows and columns will appear here'}
                          {selectedSectionData.type === 'analytics' && 'Charts and analytics visualizations will appear here'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="flex-1 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Design Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-600 dark:text-slate-400">
                      Design tools for customizing the appearance and layout of this section.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="flex-1 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-600 dark:text-slate-400">
                      Configure data sources, fields, and validation rules for this section.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Section Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-slate-600 dark:text-slate-400">
                      Advanced settings and permissions for this section.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Admin Panel Builder
                </h3>
                <p className="text-slate-500 mb-4">
                  Create custom admin interfaces with forms, tables, and dashboards
                </p>
                <Select onValueChange={addSection}>
                  <SelectTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Section
                    </Button>
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}