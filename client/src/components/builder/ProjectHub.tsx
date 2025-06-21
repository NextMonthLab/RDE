import { useState } from 'react';
import { Code, Palette, Settings, Rocket, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/hooks/useFileSystem';
import type { Project } from '@/types/ide';

interface ProjectHubProps {
  onProjectSelect: (projectId: number, mode: 'ide' | 'builder') => void;
  onCreateProject: (type: 'saas' | 'paas') => void;
}

export function ProjectHub({ onProjectSelect, onCreateProject }: ProjectHubProps) {
  const { data: projects = [] } = useProjects();
  const [selectedMode, setSelectedMode] = useState<'saas' | 'paas' | null>(null);

  const getProjectTypeIcon = (template: string) => {
    if (template.includes('saas') || template.includes('visual')) {
      return <Palette className="w-5 h-5 text-purple-500" />;
    }
    return <Code className="w-5 h-5 text-blue-500" />;
  };

  const getProjectTypeBadge = (template: string) => {
    if (template.includes('saas') || template.includes('visual')) {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-700">SaaS</Badge>;
    }
    return <Badge variant="secondary" className="bg-blue-100 text-blue-700">PaaS</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                NextMonth Builder Hub
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Create, manage, and deploy your applications
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => onCreateProject('saas')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Palette className="w-4 h-4 mr-2" />
                New SaaS App
              </Button>
              <Button
                onClick={() => onCreateProject('paas')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Code className="w-4 h-4 mr-2" />
                New PaaS Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Path Selection for New Users */}
      {projects.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Choose Your Development Path
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Select the approach that best fits your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* SaaS Path */}
            <Card className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-purple-300 dark:hover:border-purple-600">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">SaaS Builder</CardTitle>
                <CardDescription>
                  Visual application builder for business users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <li>• Drag-and-drop interface builder</li>
                  <li>• Admin panel composer</li>
                  <li>• Business planning tools</li>
                  <li>• One-click deployment</li>
                </ul>
                <Button 
                  onClick={() => onCreateProject('saas')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>

            {/* PaaS Path */}
            <Card className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-blue-300 dark:hover:border-blue-600">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">PaaS Development</CardTitle>
                <CardDescription>
                  Full IDE environment for developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <li>• Complete code editor</li>
                  <li>• Git integration</li>
                  <li>• Terminal access</li>
                  <li>• Docker configuration</li>
                </ul>
                <Button 
                  onClick={() => onCreateProject('paas')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Coding
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Project Grid */}
      {projects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your Projects
            </h2>
            <div className="text-sm text-slate-500">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    {getProjectTypeIcon(project.template)}
                    {getProjectTypeBadge(project.template)}
                  </div>
                  <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onProjectSelect(project.id, 'builder')}
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Builder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onProjectSelect(project.id, 'ide')}
                    >
                      <Code className="w-3 h-3 mr-1" />
                      IDE
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span>{project.template}</span>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}