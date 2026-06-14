import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'indigo' | 'green' | 'red';
  trend?: { value: number; label: string };
}

const COLOR_MAP = {
  blue: { bg: '#eff6ff', iconBg: '#dbeafe', icon: '#2563eb', value: '#1d4ed8' },
  yellow: { bg: '#fffbeb', iconBg: '#fef3c7', icon: '#d97706', value: '#92400e' },
  indigo: { bg: '#eef2ff', iconBg: '#e0e7ff', icon: '#4f46e5', value: '#3730a3' },
  green: { bg: '#ecfdf5', iconBg: '#d1fae5', icon: '#059669', value: '#065f46' },
  red: { bg: '#fef2f2', iconBg: '#fee2e2', icon: '#dc2626', value: '#991b1b' },
};

export function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div
      className="rounded-xl p-5 flex items-start gap-4 border"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--brand-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: colors.iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: colors.icon }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm mb-0.5" style={{ color: 'var(--brand-text-muted)' }}>
          {title}
        </p>
        <p
          className="text-3xl font-semibold leading-none mb-1"
          style={{ color: colors.value, fontFamily: 'Poppins, sans-serif' }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className="text-xs font-medium"
              style={{ color: trend.value >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)' }}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
