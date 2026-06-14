import { useState } from 'react';
import {
  ClipboardList, Clock, Activity, CheckCircle2, AlertTriangle, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { StatsCard } from './StatsCard';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import type { Task, User } from '../data/mockData';
import { MOCK_TASKS, MOCK_USERS, WEEKLY_CHART_DATA, ACTIVITY_LOGS } from '../data/mockData';

interface DashboardProps {
  currentUser: User;
  onTaskUpdate: (task: Partial<Task> & { id?: string }) => void;
  tasks: Task[];
}

function DeadlineCalendar({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.status === 'completed') return acc;
    const date = task.dueDate.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const days = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <h3 className="font-semibold mb-4 capitalize" style={{ color: 'var(--brand-text)' }}>
        📅 {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: 'var(--brand-text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = day === today.getDate();
          const hasUrgent = dayTasks.some(t => t.status === 'urgent' || t.priority === 'critical');

          return (
            <div
              key={day}
              className="relative flex flex-col items-center py-1 rounded-lg"
              style={{
                backgroundColor: isToday ? 'var(--brand-primary)' : 'transparent',
                minHeight: '32px',
              }}
            >
              <span
                className="text-xs font-medium leading-none"
                style={{ color: isToday ? '#ffffff' : 'var(--brand-text)' }}
              >
                {day}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayTasks.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: hasUrgent ? 'var(--brand-danger)' : (isToday ? '#ffffff' : 'var(--brand-primary)') }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--brand-border)' }}>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--brand-text-muted)' }}>Próximos vencimentos</p>
        {tasks
          .filter(t => t.status !== 'completed' && t.dueDate >= today.toISOString().split('T')[0])
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          .slice(0, 3)
          .map(task => (
            <div key={task.id} className="flex items-center justify-between py-1">
              <span className="text-xs truncate" style={{ color: 'var(--brand-text)', maxWidth: '140px' }}>
                {task.title}
              </span>
              <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'var(--brand-text-muted)' }}>
                {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export function Dashboard({ currentUser, onTaskUpdate, tasks }: DashboardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const urgent = tasks.filter(t => t.status === 'urgent').length;

  const urgentTasks = tasks
    .filter(t => t.status === 'urgent' || t.priority === 'critical')
    .slice(0, 5);

  const today = new Date();
  const dayName = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const fullDate = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* MARKER-MAKE-KIT-INVOKED */}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold capitalize" style={{ color: 'var(--brand-text)', fontFamily: 'Poppins, sans-serif' }}>
          Bom dia, {currentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm mt-0.5 capitalize" style={{ color: 'var(--brand-text-muted)' }}>
          {dayName}, {fullDate}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total de Tarefas" value={total} icon={ClipboardList} color="blue" subtitle={`${completed} concluídas`} />
        <StatsCard title="Pendentes" value={pending} icon={Clock} color="yellow" trend={{ value: 5, label: 'vs semana passada' }} />
        <StatsCard title="Em Andamento" value={inProgress} icon={Activity} color="indigo" />
        <StatsCard title="Concluídas" value={completed} icon={CheckCircle2} color="green" trend={{ value: 12, label: 'vs semana passada' }} />
      </div>

      {urgent > 0 && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-danger)' }} />
          <p className="text-sm font-medium" style={{ color: '#991b1b' }}>
            Você tem <strong>{urgent}</strong> {urgent === 1 ? 'tarefa urgente' : 'tarefas urgentes'} que precisa{urgent === 1 ? '' : 'm'} de atenção imediata!
          </p>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart - 2 cols */}
        <div
          className="xl:col-span-2 rounded-xl border p-5"
          style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--brand-text)' }}>Progresso Semanal</h3>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
              Esta semana
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_CHART_DATA} barSize={12} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="concluidas" name="Concluídas" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emAndamento" name="Em Andamento" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendentes" name="Pendentes" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calendar */}
        <DeadlineCalendar tasks={tasks} />
      </div>

      {/* Urgent tasks */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--brand-text)' }}>
            Tarefas Urgentes / Críticas
          </h3>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'var(--brand-danger-light)', color: 'var(--brand-danger)' }}
          >
            {urgentTasks.length} tarefas
          </span>
        </div>

        {urgentTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--brand-success)' }} />
            <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Nenhuma tarefa urgente no momento!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentTasks.map(task => {
              const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={assignee}
                  onClick={() => setSelectedTask(task)}
                  compact
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Activity log */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Atividades Recentes</h3>
        <div className="space-y-3">
          {ACTIVITY_LOGS.slice(0, 5).map(log => {
            const user = MOCK_USERS.find(u => u.id === log.userId);
            if (!user) return null;
            return (
              <div key={log.id} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--brand-text)' }}>
                    <span className="font-medium">{user.name}</span>{' '}
                    <span style={{ color: 'var(--brand-text-muted)' }}>{log.action}</span>
                    {log.taskTitle && (
                      <span className="font-medium"> "{log.taskTitle}"</span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          mode="view"
          onClose={() => setSelectedTask(null)}
          onSave={onTaskUpdate}
        />
      )}
    </div>
  );
}
