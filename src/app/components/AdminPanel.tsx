import { useState } from 'react';
import {
  Users, BarChart2, FileText, Activity, Plus, Edit2, Trash2, CheckCircle2,
  XCircle, Download, TrendingUp, AlertTriangle, Shield, UserCheck,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Button } from './ui/button';
import { StatsCard } from './StatsCard';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import type { Task, User } from '../data/mockData';
import { MOCK_USERS, ACTIVITY_LOGS, WEEKLY_CHART_DATA } from '../data/mockData';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'users' | 'reports' | 'logs';

interface AdminPanelProps {
  tasks: Task[];
  currentUser: User;
  onTaskUpdate: (task: Partial<Task> & { id?: string }) => void;
}

const PIE_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

function UserProductivityCard({ user, tasks }: { user: User; tasks: Task[] }) {
  const userTasks = tasks.filter(t => t.assigneeId === user.id);
  const completed = userTasks.filter(t => t.status === 'completed').length;
  const total = userTasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border"
      style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
        style={{ backgroundColor: user.color }}
      >
        {user.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{user.department}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: rate >= 70 ? 'var(--brand-success)' : rate >= 40 ? 'var(--brand-warning)' : 'var(--brand-danger)' }}>
              {rate}%
            </p>
            <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{completed}/{total}</p>
          </div>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#e2e8f0' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${rate}%`,
              backgroundColor: rate >= 70 ? 'var(--brand-success)' : rate >= 40 ? 'var(--brand-warning)' : 'var(--brand-danger)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function UsersTable({ tasks }: { tasks: Task[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(userId: string) {
    setDeletingId(userId);
    setTimeout(() => {
      setDeletingId(null);
      toast.success('Usuário removido com sucesso (demo)');
    }, 1000);
  }

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--brand-border)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--brand-border)' }}>
            {['Usuário', 'Departamento', 'Função', 'Tarefas', 'Conclusão', 'Status', 'Ações'].map(col => (
              <th
                key={col}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--brand-text-muted)' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map((user, idx) => {
            const userTasks = tasks.filter(t => t.assigneeId === user.id);
            const completed = userTasks.filter(t => t.status === 'completed').length;
            const rate = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0;

            return (
              <tr
                key={user.id}
                style={{
                  borderBottom: idx < MOCK_USERS.length - 1 ? '1px solid var(--brand-border)' : 'none',
                  backgroundColor: '#ffffff',
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{user.department}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: user.role === 'admin' ? 'var(--brand-primary-light)' : '#f1f5f9',
                      color: user.role === 'admin' ? 'var(--brand-primary)' : 'var(--brand-text-muted)',
                    }}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{userTasks.length}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 rounded-full h-1.5" style={{ backgroundColor: '#e2e8f0' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${rate}%`,
                          backgroundColor: rate >= 70 ? 'var(--brand-success)' : rate >= 40 ? 'var(--brand-warning)' : 'var(--brand-danger)',
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{rate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {user.isActive ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand-success)' }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                    )}
                    <span className="text-xs" style={{ color: user.isActive ? 'var(--brand-success)' : 'var(--brand-text-muted)' }}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toast.info(`Editando ${user.name} (demo)`)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--brand-danger)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ReportsTab({ tasks }: { tasks: Task[] }) {
  const byStatus = [
    { name: 'Pendente', value: tasks.filter(t => t.status === 'pending').length },
    { name: 'Em Andamento', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Concluída', value: tasks.filter(t => t.status === 'completed').length },
    { name: 'Urgente', value: tasks.filter(t => t.status === 'urgent').length },
  ];

  const byCategory = Object.entries(
    tasks.reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + 1 }), {} as Record<string, number>)
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success('Relatório exportado! (demo)')}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart by status */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
        >
          <h4 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Distribuição por Status</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byStatus}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {byStatus.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart by category */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
        >
          <h4 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Tarefas por Categoria</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byCategory} barSize={14} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="total" name="Tarefas" fill="var(--brand-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly trend */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
      >
        <h4 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Tendência Semanal</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={WEEKLY_CHART_DATA} barSize={14} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="concluidas" name="Concluídas" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="emAndamento" name="Em Andamento" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendentes" name="Pendentes" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LogsTab({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--brand-border)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--brand-border)' }}>
            {['Data/Hora', 'Usuário', 'Ação', 'Tarefa'].map(col => (
              <th key={col} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--brand-text-muted)' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ACTIVITY_LOGS.map((log, idx) => {
            const user = MOCK_USERS.find(u => u.id === log.userId);
            return (
              <tr
                key={log.id}
                style={{
                  borderBottom: idx < ACTIVITY_LOGS.length - 1 ? '1px solid var(--brand-border)' : 'none',
                  backgroundColor: '#ffffff',
                }}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono" style={{ color: 'var(--brand-text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: user.color, fontSize: '10px', fontWeight: 700 }}
                      >
                        {user.initials}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{user.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--brand-text)' }}>{log.action}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
                    {log.taskTitle ?? '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AdminPanel({ tasks, currentUser, onTaskUpdate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const urgent = tasks.filter(t => t.status === 'urgent').length;
  const overallRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeUsersCount = MOCK_USERS.filter(u => u.isActive).length;

  const TABS: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'logs', label: 'Logs', icon: Activity },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--brand-text)', fontFamily: 'Poppins, sans-serif' }}>
                Painel Administrativo
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
              Visão completa do sistema — {MOCK_USERS.length} usuários, {total} ordens de serviço
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info('Criar novo usuário (demo)')}
            style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total de OS" value={total} icon={FileText} color="blue" subtitle={`${overallRate}% concluídas`} />
          <StatsCard title="Usuários Ativos" value={activeUsersCount} icon={UserCheck} color="green" />
          <StatsCard title="Urgentes" value={urgent} icon={AlertTriangle} color="red" />
          <StatsCard title="Em Andamento" value={inProgress} icon={TrendingUp} color="indigo" />
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? 'var(--brand-text)' : 'var(--brand-text-muted)',
                boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Productivity per user */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>Produtividade por Usuário</h3>
              <div className="space-y-3">
                {MOCK_USERS.map(user => (
                  <UserProductivityCard key={user.id} user={user} tasks={tasks} />
                ))}
              </div>
            </div>

            {/* All urgent + pending */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--brand-text)' }}>
                Tarefas Críticas e Urgentes ({urgent + pending} abertas)
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {tasks
                  .filter(t => t.status === 'urgent' || (t.status === 'pending' && t.priority === 'critical'))
                  .map(task => {
                    const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        style={{ borderColor: 'var(--brand-border)', backgroundColor: '#f8fafc' }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {assignee && (
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                              style={{ backgroundColor: assignee.color }}
                            >
                              {assignee.initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--brand-text)' }}>{task.title}</p>
                            <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                              {task.orderNumber} · {assignee?.name ?? '—'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <StatusBadge status={task.status} size="sm" />
                          <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                            {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {urgent + tasks.filter(t => t.status === 'pending' && t.priority === 'critical').length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--brand-success)' }} />
                    <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>Nenhuma tarefa crítica em aberto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
                {MOCK_USERS.length} usuários registrados · {activeUsersCount} ativos
              </p>
            </div>
            <UsersTable tasks={tasks} />
          </div>
        )}

        {activeTab === 'reports' && <ReportsTab tasks={tasks} />}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
                {ACTIVITY_LOGS.length} registros de atividade
              </p>
              <Button variant="outline" size="sm" onClick={() => toast.success('Logs exportados (demo)')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
            <LogsTab tasks={tasks} />
          </div>
        )}
      </div>
    </div>
  );
}
