import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateProject } from '@/hooks/useFileSystem';
import type { CreateProjectData } from '@/types/ide';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectId: number) => void;
}

const PROJECT_TEMPLATES = [
  { value: 'react-typescript', label: 'React + TypeScript' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs-api', label: 'Node.js API' },
  { value: 'express-postgresql', label: 'Express + PostgreSQL' },
  { value: 'blank', label: 'Blank Project' },
];

export function ProjectModal({ isOpen, onClose, onProjectCreated }: ProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    template: 'react-typescript',
  });

  const createProjectMutation = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const project = await createProjectMutation.mutateAsync(formData);
      onProjectCreated(project.id);
      onClose();
      setFormData({ name: '', description: '', template: 'react-typescript' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-300">
              Project Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="my-awesome-app"
              className="bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-300">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief description of your project"
              className="bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="template" className="text-sm font-medium text-slate-300">
              Template
            </Label>
            <Select
              value={formData.template}
              onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {PROJECT_TEMPLATES.map(template => (
                  <SelectItem key={template.value} value={template.value} className="text-slate-100">
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createProjectMutation.isPending || !formData.name.trim()}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
