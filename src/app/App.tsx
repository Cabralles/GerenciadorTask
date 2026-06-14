import { useState, useCallback } from 'react';
import { Toaster } from 'sonner';
import { AppSidebar, type PageType } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { Dashboard } from './components/Dashboard';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
import type { Task, User } from './data/mockData';
import { MOCK_TASKS, MOCK_USERS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const urgentCount = tasks.filter(t => t.status === 'urgent').length;

  const handleUserSwitch = useCallback((user: User) => {
    setCurrentUser(user);
    // If user switches to non-admin and is on admin page, redirect to dashboard
    if (user.role !== 'admin' && (currentPage === 'admin-dashboard' || currentPage === 'admin-users' || currentPage === 'admin-reports')) {
      setCurrentPage('dashboard');
    }
  }, [currentPage]);

  const handleNavigate = useCallback((page: PageType) => {
    // Guard: non-admin cannot access admin pages
    if ((page === 'admin-dashboard' || page === 'admin-users' || page === 'admin-reports') && currentUser.role !== 'admin') {
      return;
    }
    setCurrentPage(page);
  }, [currentUser.role]);

  const handleTaskUpdate = useCallback((updated: Partial<Task> & { id?: string }) => {
    if (!updated.id) return;
    setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } as Task : t));
  }, []);

  const handleTaskCreate = useCallback((newTask: Partial<Task>) => {
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title ?? 'Nova Tarefa',
      description: newTask.description ?? '',
      status: newTask.status ?? 'pending',
      priority: newTask.priority ?? 'medium',
      dueDate: newTask.dueDate ?? new Date().toISOString().split('T')[0],
      assigneeId: newTask.assigneeId ?? currentUser.id,
      category: newTask.category ?? 'Operações',
      orderNumber: newTask.orderNumber ?? `OS-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [task, ...prev]);
  }, [currentUser.id]);

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            currentUser={currentUser}
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
          />
        );
      case 'user-panel':
        return (
          <UserPanel
            currentUser={currentUser}
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
          />
        );
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-reports':
        if (currentUser.role !== 'admin') {
          return (
            <div className="flex-1 flex items-center justify-center">
              <p style={{ color: 'var(--brand-text-muted)' }}>Acesso restrito a administradores.</p>
            </div>
          );
        }
        return (
          <AdminPanel
            tasks={tasks}
            currentUser={currentUser}
            onTaskUpdate={handleTaskUpdate}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--brand-bg, #F8FAFC)', fontFamily: 'Inter, sans-serif' }}
    >
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <AppSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          currentUser={currentUser}
          onUserSwitch={handleUserSwitch}
          urgentCount={urgentCount}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
