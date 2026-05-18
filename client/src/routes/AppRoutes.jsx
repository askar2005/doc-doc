import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Tasks from '../pages/Tasks';
import Profile from '../pages/Profile';
import AIChat from '../pages/AIChat';
import useAuthStore from '../store/authStore';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function AppRoutes({ bootstrapped }) {
  const location = useLocation();
  const isAuthed = useAuthStore((state) => state.isAuthenticated);

  if (!bootstrapped) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen"
    >
      <Routes>
        <Route path="/" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai" element={<AIChat />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={isAuthed ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </motion.div>
  );
}
