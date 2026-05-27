import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, User, Search, Trophy, Star,
  MessageSquare, LogOut, Zap, Users, Moon, Sun
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',      icon: User,            label: 'My Profile' },
  { to: '/ai-search',    icon: Search,          label: 'AI Search' },
  { to: '/competitions', icon: Trophy,          label: 'Competitions' },
  { to: '/teams',        icon: Users,           label: 'Teams' },
  { to: '/achievements', icon: Star,            label: 'Achievements' },
  { to: '/messages',     icon: MessageSquare,   label: 'Message' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <aside className="glass-sidebar w-64 min-h-screen flex flex-col py-7 px-4 fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-9">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-primary shadow-lg">
          <Zap size={17} className="text-white" />
        </div>
        <div>
          <span className="font-extrabold text-luna-400 dark:text-luna-100 text-lg leading-none block tracking-tight">
            Insight <span className="text-luna-200 dark:text-luna-100/70">Log</span>
          </span>
          <span className="text-[10px] text-luna-300 dark:text-luna-200/50 font-medium">IT-Run Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-luna-200 to-luna-300 text-white shadow-md shadow-luna-300/30'
                  : 'text-luna-300 dark:text-luna-100/60 hover:bg-white/40 dark:hover:bg-luna-400/30 hover:text-luna-400 dark:hover:text-luna-100'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Settings label */}
      <div className="mt-4 px-3.5 py-2.5 text-sm font-semibold text-luna-300/60 dark:text-luna-100/30 flex items-center gap-3 cursor-default">
        <span className="text-base">⚙️</span> Settings
      </div>

      {/* Dark mode */}
      <div className="mt-1 px-3.5 py-3 rounded-xl bg-white/30 dark:bg-luna-500/40 border border-white/50 dark:border-luna-100/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {dark
              ? <Moon size={14} className="text-luna-100" />
              : <Sun size={14} className="text-luna-300" />}
            <span className="text-xs font-semibold text-luna-400 dark:text-luna-100/70">
              {dark ? 'Dark mode' : 'Light mode'}
            </span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={dark} onChange={toggle} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* User card */}
      <div className="mt-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-luna-200/20 to-luna-300/20 dark:from-luna-400/30 dark:to-luna-500/30 border border-luna-200/30 dark:border-luna-100/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 btn-primary shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-luna-400 dark:text-luna-100 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-luna-300/70 dark:text-luna-100/40 truncate">{user?.university || 'Student'}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-luna-200/60 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50/20"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
