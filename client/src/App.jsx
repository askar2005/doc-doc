import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from './routes/AppRoutes';
import useAuthStore from './store/authStore';
import useAppStore from './store/appStore';
import Particles from './components/ui/Particles';
import ToastViewport from './components/ui/ToastViewport';

export default function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  const loadDashboard = useAppStore((state) => state.bootstrapDashboard);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (bootstrapped && isAuthenticated) {
      loadDashboard();
    }
  }, [bootstrapped, isAuthenticated, loadDashboard]);

  return (
    <>
      <Particles />
      <ToastViewport />
      <AnimatePresence mode="wait">
        <AppRoutes bootstrapped={bootstrapped} />
      </AnimatePresence>
    </>
  );
}
