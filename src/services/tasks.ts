import api from './api';

export interface Task {
  id: number;
  order_number: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'urgent' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  assigned_to?: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
  };
}

export interface CreateTaskRequest {
  order_number: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date: string;
  assigned_to?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: number;
}

export const tasksAPI = {
  getAll: (filters?: {
    status?: string;
    priority?: string;
    assigned_to?: number;
  }) =>
    api.get<Task[]>('/api/tasks', { params: filters }),

  getById: (id: number) =>
    api.get<Task>(`/api/tasks/${id}`),

  create: (data: CreateTaskRequest) =>
    api.post<Task>('/api/tasks', data),

  update: (id: number, data: UpdateTaskRequest) =>
    api.put<Task>(`/api/tasks/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/tasks/${id}`),
};
