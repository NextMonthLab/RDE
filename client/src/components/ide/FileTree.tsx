import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, File, FileCode, FileImage, FileText } from 'lucide-react';
import type { FileTreeNode } from '@/types/ide';

interface FileTreeProps {
  files: FileTreeNode[];
  onFileClick: (file: FileTreeNode) => void;
  onCreateFile: (parentId?: number) => void;
  onCreateFolder: (parentId?: number) => void;
}

export function FileTree({ files, onFileClick, onCreateFile, onCreateFolder }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  const buildTree = (files: FileTreeNode[]): FileTreeNode[] => {
    const fileMap = new Map<number, FileTreeNode>();
    const rootFiles: FileTreeNode[] = [];

    // Create map of all files
    files.forEach(file => {
      fileMap.set(file.id, { ...file, children: [] });
    });

    // Build tree structure
    files.forEach(file => {
      const fileWithChildren = fileMap.get(file.id)!;
      if (file.parentId) {
        const parent = fileMap.get(file.parentId);
        if (parent) {
          parent.children!.push(fileWithChildren);
        }
      } else {
        rootFiles.push(fileWithChildren);
      }
    });

    return rootFiles;
  };

  const toggleFolder = (folderId: number) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileTreeNode) => {
    if (file.isDirectory) {
      return expandedFolders.has(file.id) ? (
        <FolderOpen className="w-4 h-4 text-yellow-500" />
      ) : (
        <Folder className="w-4 h-4 text-yellow-500" />
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'md':
      case 'txt':
        return <FileText className="w-4 h-4 text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <FileImage className="w-4 h-4 text-green-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderTreeNode = (file: FileTreeNode, depth = 0) => {
    const isExpanded = expandedFolders.has(file.id);
    const paddingLeft = depth * 16;

    return (
      <div key={file.id}>
        <div
          className="flex items-center space-x-2 p-1 rounded cursor-pointer hover:bg-white/5 transition-colors"
          style={{ paddingLeft }}
          onClick={() => {
            if (file.isDirectory) {
              toggleFolder(file.id);
            } else {
              onFileClick(file);
            }
          }}
        >
          {file.isDirectory && (
            <button className="p-0">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </button>
          )}
          {!file.isDirectory && <div className="w-3" />}
          {getFileIcon(file)}
          <span className="text-sm text-slate-200 truncate">{file.name}</span>
        </div>
        
        {file.isDirectory && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(files);

  return (
    <div className="space-y-1">
      {tree.map(file => renderTreeNode(file))}
    </div>
  );
}
