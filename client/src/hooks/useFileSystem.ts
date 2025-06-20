import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { FileTreeNode, Project, CreateProjectData } from '@/types/ide';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
}

export function useProject(id: number) {
  return useQuery<Project>({
    queryKey: ['/api/projects', id],
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const response = await apiRequest('POST', '/api/projects', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useFileTree(projectId: number) {
  return useQuery<FileTreeNode[]>({
    queryKey: ['/api/projects', projectId, 'files'],
    enabled: !!projectId,
  });
}

export function useFile(id: number) {
  return useQuery<FileTreeNode>({
    queryKey: ['/api/files', id],
    enabled: !!id,
  });
}

export function useCreateFile(projectId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; path: string; content?: string; isDirectory?: boolean; parentId?: number }) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/files`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'files'] });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: { name?: string; content?: string } }) => {
      const response = await apiRequest('PUT', `/api/files/${id}`, updates);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/files', id] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/files/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useCreateTerminalSession() {
  return useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest('POST', '/api/terminal/session', { projectId });
      return response.json();
    },
  });
}
