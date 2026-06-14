import { useState } from 'react';
import { Search, Bell, ChevronDown, UserCircle, Shield } from 'lucide-react';
import { Button } from './ui/button';
import type { User } from '../data/mockData';
import { MOCK_USERS } from '../data/mockData';

interface AppHeaderProps {
  currentUser: User;
  onUserSwitch: (user: User) => void;
  urgentCount: number;
}

export function AppHeader({ currentUser, onUserSwitch, urgentCount }: AppHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const otherUsers = MOCK_USERS.filter(u => u.id !== currentUser.id);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
    >
      {/* Search */}
      <div className="relative w-72">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--brand-text-muted)' }}
        />
        <input
          type="text"
          placeholder="Buscar tarefas, usuários..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
          style={{
            backgroundColor: 'var(--brand-bg, #F8FAFC)',
            border: '1px solid var(--brand-border)',
            color: 'var(--brand-text)',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--brand-primary)'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--brand-border)'; }}
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ color: 'var(--brand-text-muted)' }}
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ backgroundColor: 'var(--brand-danger)', fontSize: '10px' }}
            >
              {urgentCount}
            </span>
          )}
        </button>

        {/* User switcher (demo) */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50 border"
            style={{ borderColor: 'var(--brand-border)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: currentUser.color }}
            >
              {currentUser.initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium leading-tight" style={{ color: 'var(--brand-text)' }}>
                {currentUser.name.split(' ')[0]}
              </p>
              <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--brand-text-muted)' }} />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border overflow-hidden z-50"
              style={{ backgroundColor: '#ffffff', borderColor: 'var(--brand-border)' }}
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--brand-border)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--brand-text-muted)' }}>
                  Trocar usuário (demo)
                </p>
              </div>
              {otherUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => { onUserSwitch(user); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--brand-text)' }}>
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3" style={{ color: 'var(--brand-primary)' }} />
                      ) : (
                        <UserCircle className="w-3 h-3" style={{ color: 'var(--brand-text-muted)' }} />
                      )}
                      <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                        {user.department}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo role badge */}
        {currentUser.role === 'admin' && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}
          >
            <Shield className="w-3 h-3" />
            Admin
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
