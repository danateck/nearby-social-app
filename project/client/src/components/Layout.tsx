import { NavLink, Outlet } from 'react-router-dom';
import {
  Compass,
  Home,
  LogOut,
  MessageCircle,
  Users,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/nearby', label: 'Nearby', icon: Compass },
  { to: '/friends', label: 'Friends', icon: UserRound },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/groups', label: 'Groups', icon: Users },
];

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-slate-50 shadow-2xl">
        <header className="sticky top-0 z-40 border-b bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                Nearby Social
              </p>
              <h1 className="text-lg font-bold text-slate-900">QuickMeet</h1>
            </div>

            <button
              onClick={logout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-700 hover:bg-slate-50"
              type="button"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-28">
          <Outlet />
        </main>

        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t bg-white/95 px-3 py-2 backdrop-blur">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={19} />
                <span className="mt-1">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}