import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ide/Header';
import { Sidebar } from '@/components/ide/Sidebar';
import { EditorArea } from '@/components/ide/EditorArea';
import { Terminal } from '@/components/ide/Terminal';
import { useProjects, useProject, useFile } from '@/hooks/useFileSystem';
import { useToast } from '@/hooks/use-toast';
import type { EditorTab, FileTreeNode, Project } from '@/types/ide';

export default function IDE() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const currentProjectId = params.projectId ? parseInt(params.projectId) : null;
  const [tabs, setTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { data: projects = [] } = useProjects();
  const { data: currentProject } = useProject(currentProjectId || 0);

  const handleProjectChange = (projectId: number) => {
    setLocation(`/ide/${projectId}`);
    // Clear tabs when switching projects
    setTabs([]);
    setActiveTabId(null);
  };

  const handleFileSelect = async (file: FileTreeNode) => {
    if (file.isDirectory) return;

    // Check if file is already open
    const existingTab = tabs.find(tab => tab.id === file.id);
    if (existingTab) {
      setActiveTabId(file.id);
      return;
    }

    // Create new tab
    const newTab: EditorTab = {
      id: file.id,
      name: file.name,
      path: file.path,
      content: file.content || '',
      isDirty: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(file.id);
  };

  const handleTabClose = (tabId: number) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.isDirty) {
      const shouldClose = confirm(`${tab.name} has unsaved changes. Are you sure you want to close it?`);
      if (!shouldClose) return;
    }

    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  const handleContentChange = (tabId: number, content: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId
        ? { ...tab, content, isDirty: content !== tab.content }
        : tab
    ));
  };

  const handleSaveAll = () => {
    const dirtyTabs = tabs.filter(tab => tab.isDirty);
    if (dirtyTabs.length === 0) {
      toast({
        title: "No changes to save",
        description: "All files are up to date.",
      });
      return;
    }

    // In a real implementation, this would save all dirty tabs
    toast({
      title: "Files saved",
      description: `Saved ${dirtyTabs.length} file(s).`,
    });
  };

  const handleDeploy = () => {
    if (!currentProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to deploy.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Deployment started",
      description: `Deploying ${currentProject.name}...`,
    });
  };

  if (!currentProjectId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="text-center">
          <h2 className="text-xl mb-4">Project not found</h2>
          <Button onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* IDE Header with back button */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
          <div className="text-sm text-slate-400">
            IDE Mode: {currentProject?.name || 'Loading...'}
          </div>
        </div>
      </div>
      
      <Header
        currentProject={currentProject || null}
        onProjectChange={handleProjectChange}
        onSaveAll={handleSaveAll}
        onDeploy={handleDeploy}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          projectId={currentProjectId}
          onFileSelect={handleFileSelect}
        />
        
        <EditorArea
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          onTabClose={handleTabClose}
          onContentChange={handleContentChange}
        />
      </div>
      
      <Terminal projectId={currentProjectId} />
    </div>
  );
}
