import { NavLink, Outlet } from 'react-router-dom';
import { Compass, Home, LogOut, MessageCircle, Users, UserRound, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/nearby', label: 'Nearby', icon: Compass },
  { to: '/friends', label: 'Friends', icon: UserRound },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/stories', label: 'Stories', icon: Camera }
];

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Nearby Social</p>
            <h1 className="text-xl font-bold text-slate-900">Social app</h1>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-white p-4 shadow-soft">
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
