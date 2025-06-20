import { useState } from 'react';
import { Code, Save, Rocket, Settings, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectModal } from './ProjectModal';
import { useProjects } from '@/hooks/useFileSystem';
import type { Project } from '@/types/ide';

interface HeaderProps {
  currentProject: Project | null;
  onProjectChange: (projectId: number) => void;
  onSaveAll: () => void;
  onDeploy: () => void;
}

export function Header({ currentProject, onProjectChange, onSaveAll, onDeploy }: HeaderProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { data: projects = [] } = useProjects();

  return (
    <>
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-slate-100">NextMonth R.I.D.</h1>
          </div>
          
          {/* Project Selector */}
          <div className="flex items-center space-x-2">
            <Select
              value={currentProject?.id.toString() || ''}
              onValueChange={(value) => onProjectChange(parseInt(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 min-w-48">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id.toString()} className="text-slate-100">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onSaveAll}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Save className="w-4 h-4 mr-1" />
            Save All
          </Button>
          <Button
            onClick={onDeploy}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Rocket className="w-4 h-4 mr-1" />
            Deploy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={(projectId) => onProjectChange(projectId)}
      />
    </>
  );
}
