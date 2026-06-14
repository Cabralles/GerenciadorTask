import { useState } from 'react';
import {
  Plus, Filter, CheckCircle2, Clock, Activity, Zap, Search, ClipboardList,
} from 'lucide-react';
import { Button } from './ui/button';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { StatusBadge } from './StatusBadge';
import type { Task, User, TaskStatus } from '../data/mockData';
import { MOCK_USERS, ACTIVITY_LOGS } from '../data/mockData';

type FilterTab = 'all' | TaskStatus;

interface FilterTabConfig {
  id: FilterTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const FILTER_TABS: FilterTabConfig[] = [
  { id: 'all', label: 'Todas', icon: ClipboardList, color: 'var(--brand-primary)' },
  { id: 'urgent', label: 'Urgentes', icon: Zap, color: 'var(--brand-danger)' },
  { id: 'in_progress', label: 'Em Andamento', icon: Activity, color: '#3B82F6' },
  { id: 'pending', label: 'Pendentes', icon: Clock, color: 'var(--brand-warning)' },
  { id: 'completed', label: 'Concluídas', icon: CheckCircle2, color: 'var(--brand-success)' },
];

interface UserPanelProps {
  currentUser: User;
  tasks: Task[];
  onTaskUpdate: (task: Partial<Task> & { id?: string }) => void;
  onTaskCreate: (task: Partial<Task>) => void;
}

export function UserPanel({ currentUser, tasks, onTaskUpdate, onTaskCreate }: UserPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [searchQuery, setSearchQuery] = useState('');

  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);

  const filteredTasks = userTasks
    .filter(t => activeFilter === 'all' || t.status === activeFilter)
    .filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const countByStatus = (status: FilterTab) =>
    status === 'all' ? userTasks.length : userTasks.filter(t => t.status === status).length;

  const userLogs = ACTIVITY_LOGS.filter(l => l.userId === currentUser.id);

  const completionRate = userTasks.length > 0
    ? Math.round((userTasks.filter(t => t.status === 'completed').length / userTasks.length) * 100)
    : 0;

  function openCreate() {
    setSelectedTask(null);
    setModalMode('create');
    setSelectedTask({} as Task);
  }

  function openTask(task: Task) {
    setSelectedTask(task);
    setModalMode('view');
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Profile card */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-semibold flex-shrink-0"
              style={{ backgroundColor: currentUser.color }}
            >
              {currentUser.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--brand-text)', fontFamily: 'Poppins, sans-serif' }}>
                    {currentUser.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
                    {currentUser.department} · {currentUser.email}
                  </p>
                  <span
                    className="inline-flex items-center mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: currentUser.role === 'admin' ? 'var(--brand-primary-light)' : '#f1f5f9',
                      color: currentUser.role === 'admin' ? 'var(--brand-primary)' : 'var(--brand-text-muted)',
                    }}
                  >
                    {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Taxa de conclusão</p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--brand-success)', fontFamily: 'Poppins, sans-serif' }}>
                    {completionRate}%
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mt-3">
                {[
                  { label: 'Total', value: userTasks.length, color: 'var(--brand-text)' },
                  { label: 'Concluídas', value: userTasks.filter(t => t.status === 'completed').length, color: 'var(--brand-success)' },
                  { label: 'Em Andamento', value: userTasks.filter(t => t.status === 'in_progress').length, color: '#3B82F6' },
                  { label: 'Urgentes', value: userTasks.filter(t => t.status === 'urgent').length, color: 'var(--brand-danger)' },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="text-center p-2 rounded-lg"
                    style={{ backgroundColor: '#f8fafc' }}
                  >
                    <p className="text-lg font-semibold leading-none" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--brand-text)', fontFamily: 'Poppins, sans-serif' }}>
              Minhas Tarefas
            </h2>
            <Button
              size="sm"
              onClick={openCreate}
              style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff' }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Tarefa
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {FILTER_TABS.map(tab => {
              const count = countByStatus(tab.id);
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                  style={{
                    backgroundColor: isActive ? tab.color : '#ffffff',
                    color: isActive ? '#ffffff' : 'var(--brand-text-muted)',
                    borderColor: isActive ? tab.color : 'var(--brand-border)',
                  }}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : 'var(--brand-text-muted)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--brand-text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg text-sm outline-none border"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: 'var(--brand-border)',
                  color: 'var(--brand-text)',
                  width: '160px',
                }}
              />
            </div>
          </div>

          {/* Task list */}
          {filteredTasks.length === 0 ? (
            <div
              className="text-center py-12 rounded-xl border"
              style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
              <p className="font-medium" style={{ color: 'var(--brand-text-muted)' }}>
                {searchQuery ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa nesta categoria'}
              </p>
              <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                {!searchQuery && 'Clique em "Nova Tarefa" para criar uma.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={MOCK_USERS.find(u => u.id === task.assigneeId)}
                  onClick={() => openTask(task)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity history */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Histórico de Atividades</h3>
          {userLogs.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--brand-text-muted)' }}>Nenhuma atividade registrada.</p>
          ) : (
            <div className="space-y-3">
              {userLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 relative">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  />
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--brand-text)' }}>
                      {log.action}
                      {log.taskTitle && (
                        <span className="font-medium"> — {log.taskTitle}</span>
                      )}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                      {new Date(log.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTask !== null && (
        <TaskModal
          task={Object.keys(selectedTask).length > 0 ? selectedTask : undefined}
          mode={modalMode}
          onClose={() => setSelectedTask(null)}
          onSave={(data) => {
            if (modalMode === 'create') onTaskCreate(data);
            else onTaskUpdate(data);
          }}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}
