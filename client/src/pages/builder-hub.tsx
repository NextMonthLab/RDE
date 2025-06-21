import { useState } from 'react';
import { useLocation } from 'wouter';
import { ProjectHub } from '@/components/builder/ProjectHub';
import { VisualBuilder } from '@/components/builder/VisualBuilder';
import { AdminPanelBuilder } from '@/components/builder/AdminPanelBuilder';
import { BusinessPlanner } from '@/components/builder/BusinessPlanner';
import { ProjectModal } from '@/components/ide/ProjectModal';

type ViewMode = 'hub' | 'visual-builder' | 'admin-builder' | 'business-planner';

export default function BuilderHub() {
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<ViewMode>('hub');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalType, setProjectModalType] = useState<'saas' | 'paas'>('saas');

  const handleProjectSelect = (projectId: number, mode: 'ide' | 'builder') => {
    if (mode === 'ide') {
      setLocation(`/ide/${projectId}`);
    } else {
      setSelectedProjectId(projectId);
      setCurrentView('visual-builder');
    }
  };

  const handleCreateProject = (type: 'saas' | 'paas') => {
    setProjectModalType(type);
    setIsProjectModalOpen(true);
  };

  const handleProjectCreated = (projectId: number) => {
    setSelectedProjectId(projectId);
    if (projectModalType === 'saas') {
      setCurrentView('visual-builder');
    } else {
      setLocation(`/ide/${projectId}`);
    }
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setSelectedProjectId(null);
  };

  // Navigation between builder modes
  const navigateToBuilder = (mode: ViewMode) => {
    setCurrentView(mode);
  };

  if (currentView === 'hub') {
    return (
      <>
        <ProjectHub
          onProjectSelect={handleProjectSelect}
          onCreateProject={handleCreateProject}
        />
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      </>
    );
  }

  if (!selectedProjectId) {
    return <div>Project not selected</div>;
  }

  switch (currentView) {
    case 'visual-builder':
      return (
        <div className="h-screen flex flex-col">
          {/* Builder Navigation */}
          <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateToBuilder('visual-builder')}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === 'visual-builder'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Visual Builder
              </button>
              <button
                onClick={() => navigateToBuilder('admin-builder')}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === 'admin-builder'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Admin Panel
              </button>
              <button
                onClick={() => navigateToBuilder('business-planner')}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === 'business-planner'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Business Planner
              </button>
            </div>
          </div>
          <VisualBuilder projectId={selectedProjectId} onBack={handleBackToHub} />
        </div>
      );

    case 'admin-builder':
      return (
        <AdminPanelBuilder projectId={selectedProjectId} onBack={handleBackToHub} />
      );

    case 'business-planner':
      return (
        <BusinessPlanner projectId={selectedProjectId} onBack={handleBackToHub} />
      );

    default:
      return <div>Unknown view</div>;
  }
}