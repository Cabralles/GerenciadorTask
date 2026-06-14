import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import type { User } from '../data/mockData';

export type PageType = 'dashboard' | 'user-panel' | 'admin-dashboard' | 'admin-users' | 'admin-reports';

interface NavItem {
  id: PageType;
  label: string;
  icon: React.FC<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'user-panel', label: 'Minhas Tarefas', icon: CheckSquare },
  { id: 'admin-dashboard', label: 'Visão Admin', icon: ShieldCheck, adminOnly: true },
  { id: 'admin-users', label: 'Usuários', icon: Users, adminOnly: true },
  { id: 'admin-reports', label: 'Relatórios', icon: BarChart2, adminOnly: true },
];

interface AppSidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  currentUser: User;
}

export function AppSidebar({ currentPage, onNavigate, currentUser }: AppSidebarProps) {
  const isAdmin = currentUser.role === 'admin';
  const visibleItems = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      className="w-60 min-h-screen flex flex-col flex-shrink-0"
      style={{ backgroundColor: 'var(--brand-sidebar)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-semibold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              TaskOS
            </span>
            <p className="text-xs" style={{ color: '#64748b' }}>Ordens de Serviço</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-xs uppercase tracking-wider" style={{ color: '#475569' }}>
          Menu
        </p>
        {visibleItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
              style={{
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                }
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              <div className="border-t border-white/10" />
            </div>
          </>
        )}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-2">
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
          }}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Configurações</span>
        </button>
      </div>

      {/* User info */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate leading-tight">{currentUser.name}</p>
            <p className="text-xs truncate" style={{ color: '#64748b' }}>{currentUser.department}</p>
          </div>
          {currentUser.role === 'admin' && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(0,102,204,0.3)', color: '#60a5fa' }}
            >
              Admin
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
