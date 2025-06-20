import { useState } from 'react';
import { X, FileCode, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from './CodeEditor';
import { useUpdateFile } from '@/hooks/useFileSystem';
import type { EditorTab, FileTreeNode } from '@/types/ide';

interface EditorAreaProps {
  tabs: EditorTab[];
  activeTabId: number | null;
  onTabChange: (tabId: number) => void;
  onTabClose: (tabId: number) => void;
  onContentChange: (tabId: number, content: string) => void;
}

export function EditorArea({ tabs, activeTabId, onTabChange, onTabClose, onContentChange }: EditorAreaProps) {
  const updateFileMutation = useUpdateFile();
  const [savingTabs, setSavingTabs] = useState<Set<number>>(new Set());

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleSave = async (tab: EditorTab) => {
    if (!tab.isDirty) return;

    setSavingTabs(prev => new Set(prev).add(tab.id));
    
    try {
      await updateFileMutation.mutateAsync({
        id: tab.id,
        updates: { content: tab.content }
      });
      
      // Mark tab as clean
      onContentChange(tab.id, tab.content);
    } catch (error) {
      console.error('Failed to save file:', error);
    } finally {
      setSavingTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete(tab.id);
        return newSet;
      });
    }
  };

  const getTabIcon = (tab: EditorTab) => {
    const ext = tab.name.split('.').pop()?.toLowerCase();
    const isCode = ['ts', 'tsx', 'js', 'jsx', 'css', 'scss', 'html', 'json'].includes(ext || '');
    
    return isCode ? (
      <FileCode className="w-4 h-4 text-blue-400" />
    ) : (
      <File className="w-4 h-4 text-slate-400" />
    );
  };

  if (tabs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="text-center">
          <FileCode className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-lg mb-2">No files open</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Editor Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 flex items-center overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center space-x-2 px-4 py-2 border-r border-slate-700 cursor-pointer transition-colors min-w-0 ${
              tab.id === activeTabId
                ? 'bg-slate-900 border-b-2 border-blue-500'
                : 'hover:bg-slate-700'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {getTabIcon(tab)}
            <span className="text-sm text-slate-200 truncate max-w-32">
              {tab.name}
              {tab.isDirty && <span className="text-orange-400 ml-1">●</span>}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200 ml-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Code Editor */}
      {activeTab && (
        <div className="flex-1 relative">
          <CodeEditor
            tab={activeTab}
            onContentChange={(content) => onContentChange(activeTab.id, content)}
            className="h-full"
          />
          
          {/* Save indicator */}
          {activeTab.isDirty && (
            <div className="absolute top-2 right-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSave(activeTab)}
                disabled={savingTabs.has(activeTab.id)}
              >
                {savingTabs.has(activeTab.id) ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
