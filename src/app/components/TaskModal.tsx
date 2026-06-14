import { useState } from 'react';
import { X, Calendar, User, Tag, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import type { Task, User as UserType, TaskStatus, TaskPriority } from '../data/mockData';
import { MOCK_USERS, CATEGORIES } from '../data/mockData';

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Partial<Task> & { id?: string }) => void;
  mode: 'view' | 'edit' | 'create';
  currentUserId?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluída' },
  { value: 'urgent', label: 'Urgente' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--brand-border)',
  fontSize: '14px',
  color: 'var(--brand-text)',
  backgroundColor: '#f8fafc',
  outline: 'none',
};

export function TaskModal({ task, onClose, onSave, mode, currentUserId }: TaskModalProps) {
  const isEditing = mode === 'edit' || mode === 'create';
  const isCreate = mode === 'create';

  const [form, setForm] = useState<Partial<Task>>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'pending',
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? new Date().toISOString().split('T')[0],
    assigneeId: task?.assigneeId ?? currentUserId ?? 'u2',
    category: task?.category ?? 'Manutenção',
    orderNumber: task?.orderNumber ?? `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
  });

  const [editMode, setEditMode] = useState(isEditing);

  const assignee = MOCK_USERS.find(u => u.id === (editMode ? form.assigneeId : task?.assigneeId));

  function handleSubmit() {
    if (!form.title?.trim()) return;
    onSave({ ...task, ...form });
    onClose();
  }

  function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--brand-text-muted)' }}>
          {label}
        </label>
        {children}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#ffffff', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'var(--brand-border)' }}
        >
          <div className="flex-1 min-w-0">
            {editMode ? (
              <input
                type="text"
                placeholder="Título da tarefa..."
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="text-lg font-semibold w-full outline-none"
                style={{ color: 'var(--brand-text)', backgroundColor: 'transparent' }}
                autoFocus
              />
            ) : (
              <h2 className="text-lg font-semibold" style={{ color: 'var(--brand-text)' }}>
                {task?.title}
              </h2>
            )}
            {!editMode && task && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono" style={{ color: 'var(--brand-text-muted)' }}>
                  {task.orderNumber}
                </span>
                <StatusBadge status={task.status} size="sm" />
                <PriorityBadge priority={task.priority} size="sm" />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {editMode ? (
            <>
              <Field label="Descrição">
                <textarea
                  placeholder="Descreva a tarefa em detalhes..."
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}
                    style={inputStyle}
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Prioridade">
                  <select
                    value={form.priority}
                    onChange={(e) => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}
                    style={inputStyle}
                  >
                    {PRIORITY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Data de Vencimento">
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Responsável">
                  <select
                    value={form.assigneeId}
                    onChange={(e) => setForm(p => ({ ...p, assigneeId: e.target.value }))}
                    style={inputStyle}
                  >
                    {MOCK_USERS.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Categoria">
                  <select
                    value={form.category}
                    onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                    style={inputStyle}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Nº da Ordem">
                  <input
                    type="text"
                    value={form.orderNumber}
                    readOnly
                    style={{ ...inputStyle, opacity: 0.6 }}
                  />
                </Field>
              </div>
            </>
          ) : (
            task && (
              <>
                {task.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--brand-text-muted)' }}>Descrição</span>
                    </div>
                    <p className="text-sm leading-relaxed pl-6" style={{ color: 'var(--brand-text)' }}>
                      {task.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Vencimento</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>

                  {assignee && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                      <div>
                        <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Responsável</p>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: assignee.color, fontSize: '8px', fontWeight: 700 }}
                          >
                            {assignee.initials}
                          </div>
                          <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                            {assignee.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Categoria</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>{task.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--brand-text-muted)' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>Criada em</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                        {new Date(task.createdAt + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                {task.completedAt && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--brand-success-light)' }}
                  >
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand-success)' }} />
                    <p className="text-sm" style={{ color: 'var(--brand-success)' }}>
                      Concluída em {new Date(task.completedAt + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                {task.status === 'urgent' && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--brand-danger-light)' }}
                  >
                    <AlertCircle className="w-4 h-4" style={{ color: 'var(--brand-danger)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--brand-danger)' }}>
                      Esta tarefa requer atenção imediata!
                    </p>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: 'var(--brand-border)', backgroundColor: '#f8fafc' }}
        >
          {!isCreate && !editMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Editar Tarefa
            </Button>
          )}
          {!editMode && <div />}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onClose}>
              {editMode ? 'Cancelar' : 'Fechar'}
            </Button>
            {editMode && (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!form.title?.trim()}
                style={{ backgroundColor: 'var(--brand-primary)', color: '#ffffff' }}
              >
                {isCreate ? 'Criar Tarefa' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
