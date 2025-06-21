export interface BuilderProject extends Project {
  builderType: 'saas' | 'paas';
  builderConfig?: {
    visualComponents?: any[];
    adminPanels?: any[];
    businessPlan?: any;
  };
}

export interface VisualComponent {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: VisualComponent[];
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AdminPanel {
  id: string;
  title: string;
  sections: AdminPanelSection[];
  layout: 'grid' | 'tabs' | 'sidebar';
}

export interface AdminPanelSection {
  id: string;
  type: 'dashboard' | 'form' | 'table' | 'analytics';
  title: string;
  config: Record<string, any>;
  position: { row: number; col: number };
  size: { rows: number; cols: number };
}

export interface BusinessGoal {
  id: string;
  title: string;
  description: string;
  category: 'revenue' | 'users' | 'features' | 'marketing';
  targetValue: number;
  currentValue: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface BusinessMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  dependencies?: string[];
}

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  domain?: string;
  scaling: {
    minInstances: number;
    maxInstances: number;
  };
  environment_variables: Record<string, string>;
}