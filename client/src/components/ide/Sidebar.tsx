import { Plus, FolderPlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileTree } from './FileTree';
import { useFileTree, useCreateFile } from '@/hooks/useFileSystem';
import type { FileTreeNode } from '@/types/ide';

interface SidebarProps {
  projectId: number;
  onFileSelect: (file: FileTreeNode) => void;
}

export function Sidebar({ projectId, onFileSelect }: SidebarProps) {
  const { data: files = [], isLoading, refetch } = useFileTree(projectId);
  const createFileMutation = useCreateFile(projectId);

  const handleCreateFile = async (parentId?: number) => {
    const name = prompt('Enter file name:');
    if (!name) return;

    const parentPath = parentId ? 
      files.find(f => f.id === parentId)?.path || '' : '';
    const path = parentPath ? `${parentPath}/${name}` : `/${name}`;

    try {
      await createFileMutation.mutateAsync({
        name,
        path,
        content: '',
        parentId,
      });
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const handleCreateFolder = async (parentId?: number) => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    const parentPath = parentId ? 
      files.find(f => f.id === parentId)?.path || '' : '';
    const path = parentPath ? `${parentPath}/${name}` : `/${name}`;

    try {
      await createFileMutation.mutateAsync({
        name,
        path,
        isDirectory: true,
        parentId,
      });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Explorer</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => handleCreateFile()}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => handleCreateFolder()}
            >
              <FolderPlus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-sm text-slate-400">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-sm text-slate-400">No files found</div>
        ) : (
          <FileTree
            files={files}
            onFileClick={onFileSelect}
            onCreateFile={handleCreateFile}
            onCreateFolder={handleCreateFolder}
          />
        )}
      </div>
    </div>
  );
}
