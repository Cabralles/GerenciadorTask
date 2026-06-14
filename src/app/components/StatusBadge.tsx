import type { TaskStatus, TaskPriority } from '../data/mockData';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; color: string; dot: string }> = {
  pending: { label: 'Pendente', bg: '#fffbeb', color: '#d97706', dot: '#F59E0B' },
  in_progress: { label: 'Em Andamento', bg: '#eff6ff', color: '#2563eb', dot: '#3B82F6' },
  completed: { label: 'Concluída', bg: '#ecfdf5', color: '#059669', dot: '#10B981' },
  urgent: { label: 'Urgente', bg: '#fef2f2', color: '#dc2626', dot: '#EF4444' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const padding = size === 'sm' ? '2px 8px' : '3px 10px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium"
      style={{ backgroundColor: config.bg, color: config.color, padding, fontSize }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.dot }}
      />
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; bg: string; color: string }> = {
  low: { label: 'Baixa', bg: '#f1f5f9', color: '#64748b' },
  medium: { label: 'Média', bg: '#fffbeb', color: '#d97706' },
  high: { label: 'Alta', bg: '#fff7ed', color: '#ea580c' },
  critical: { label: 'Crítica', bg: '#fef2f2', color: '#dc2626' },
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const padding = size === 'sm' ? '2px 8px' : '3px 10px';
  const fontSize = size === 'sm' ? '11px' : '12px';

  return (
    <span
      className="inline-flex items-center rounded-full font-medium"
      style={{ backgroundColor: config.bg, color: config.color, padding, fontSize }}
    >
      {config.label}
    </span>
  );
}
