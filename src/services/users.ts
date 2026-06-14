import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  task_id?: number;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export const usersAPI = {
  getAll: () =>
    api.get('/api/users'),

  getById: (id: number) =>
    api.get(`/api/users/${id}`),

  getMyNotifications: () =>
    api.get<Notification[]>('/api/users/notifications/me'),

  markNotificationAsRead: (notificationId: number) =>
    api.put<Notification>(`/api/users/notifications/${notificationId}/read`),
};
