import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Activity, Brain, LayoutDashboard, ListChecks, LogOut, User2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Modal from '../components/ui/Modal';
import PrimaryButton from '../components/ui/PrimaryButton';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/analytics', label: 'Charts', icon: Activity },
  { to: '/ai', label: 'AI', icon: Brain },
  { to: '/profile', label: 'Profile', icon: User2 }
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition',
          isActive ? 'bg-white/10 text-cyan-300 shadow-neon' : 'text-slate-300/80'
        ].join(' ')
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const confirmLogoutOpen = useUiStore((state) => state.confirmLogoutOpen);
  const openLogoutConfirm = useUiStore((state) => state.openLogoutConfirm);
  const closeLogoutConfirm = useUiStore((state) => state.closeLogoutConfirm);

  const handleLogout = () => {
    closeLogoutConfirm();
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Doc-Doc</p>
            <h1 className="text-lg font-semibold text-white">Skin Glow and Hair Growth Coach</h1>
          </div>
          <button
            type="button"
            onClick={openLogoutConfirm}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F1A]/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-5 gap-2 px-3 py-3">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      <Modal
        open={confirmLogoutOpen}
        title="Sign out?"
        description="You can safely come back anytime. Your session will end on this device."
        onClose={closeLogoutConfirm}
      >
        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeLogoutConfirm}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
          >
            Cancel
          </button>
          <PrimaryButton type="button" onClick={handleLogout} className="flex-1">
            Logout
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
