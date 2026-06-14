import { Calendar, User, Tag } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import type { Task, User as UserType } from '../data/mockData';

interface TaskCardProps {
  task: Task;
  assignee?: UserType;
  onClick?: () => void;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function isOverdue(dateStr: string, status: string): boolean {
  if (status === 'completed') return false;
  return new Date(dateStr + 'T23:59:59') < new Date();
}

export function TaskCard({ task, assignee, onClick, compact = false }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      onClick={onClick}
      className="rounded-xl border transition-all cursor-pointer group"
      style={{
        backgroundColor: '#ffffff',
        borderColor: task.status === 'urgent' ? '#fca5a5' : 'var(--brand-border)',
        borderLeftWidth: task.status === 'urgent' ? '3px' : '1px',
        borderLeftColor: task.status === 'urgent' ? 'var(--brand-danger)' : 'var(--brand-border)',
        padding: compact ? '12px 14px' : '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Order number + status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono" style={{ color: 'var(--brand-text-muted)' }}>
          {task.orderNumber}
        </span>
        <StatusBadge status={task.status} size="sm" />
      </div>

      {/* Title */}
      <h3
        className="font-medium mb-2 leading-snug group-hover:text-blue-600 transition-colors"
        style={{
          color: 'var(--brand-text)',
          fontSize: compact ? '13px' : '14px',
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          opacity: task.status === 'completed' ? 0.7 : 1,
        }}
      >
        {task.title}
      </h3>

      {!compact && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--brand-text-muted)' }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} size="sm" />
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" style={{ color: 'var(--brand-text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              {task.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {assignee && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: assignee.color, fontSize: '9px', fontWeight: 600 }}
              title={assignee.name}
            >
              {assignee.initials}
            </div>
          )}
          <div
            className="flex items-center gap-1"
            style={{ color: overdue ? 'var(--brand-danger)' : 'var(--brand-text-muted)' }}
          >
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{formatDate(task.dueDate)}</span>
            {overdue && <span className="text-xs font-medium">(Vencida)</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
