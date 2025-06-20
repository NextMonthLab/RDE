export interface FileTreeNode {
  id: number;
  name: string;
  path: string;
  content?: string;
  isDirectory: boolean;
  parentId?: number;
  projectId: number;
  children?: FileTreeNode[];
  expanded?: boolean;
}

export interface EditorTab {
  id: number;
  name: string;
  path: string;
  content: string;
  isDirty: boolean;
  language?: string;
}

export interface TerminalOutput {
  type: 'output' | 'input' | 'exit';
  data: string;
  timestamp: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  template: string;
  userId: number;
  settings: {
    theme?: string;
    tabSize?: number;
    wordWrap?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  template: string;
  settings?: {
    theme?: string;
    tabSize?: number;
    wordWrap?: boolean;
  };
}
