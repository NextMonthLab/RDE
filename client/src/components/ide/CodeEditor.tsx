import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { configureMonaco, getLanguageFromPath } from '@/lib/monacoLoader';
import type { EditorTab } from '@/types/ide';

interface CodeEditorProps {
  tab: EditorTab;
  onContentChange: (content: string) => void;
  className?: string;
}

export function CodeEditor({ tab, onContentChange, className = '' }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    configureMonaco();
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    // Dispose existing editor
    if (editor) {
      editor.dispose();
    }

    const newEditor = monaco.editor.create(editorRef.current, {
      value: tab.content,
      language: getLanguageFromPath(tab.path),
      theme: 'ridDark',
      fontSize: 14,
      fontFamily: '"Fira Code", "Monaco", "Menlo", monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: true },
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
    });

    // Listen for content changes
    newEditor.onDidChangeModelContent(() => {
      const content = newEditor.getValue();
      onContentChange(content);
    });

    setEditor(newEditor);

    return () => {
      newEditor.dispose();
    };
  }, [tab.id]);

  // Update content when tab changes
  useEffect(() => {
    if (editor && editor.getValue() !== tab.content) {
      editor.setValue(tab.content);
    }
  }, [tab.content, editor]);

  return (
    <div className={`h-full ${className}`}>
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
