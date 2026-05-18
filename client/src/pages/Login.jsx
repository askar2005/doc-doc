import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const pushToast = useUiStore((state) => state.pushToast);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      pushToast({ type: 'success', title: 'Welcome back', message: 'Session restored successfully.' });
      navigate('/dashboard');
    } catch (authError) {
      pushToast({
        type: 'error',
        title: 'Login failed',
        message: authError.response?.data?.message || authError.message || 'Please try again'
      });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <AuthForm
        title="Welcome back"
        subtitle="Log in to continue your glow and growth streak."
        onSubmit={submit}
        submitLabel="Login"
        error={error}
        loading={loading}
        footerText="New here?"
        footerLink="/signup"
        fields={
          <>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-[#0B0F1A]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-[#0B0F1A]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            />
            <div className="text-center text-sm text-slate-500">
              <Link className="text-cyan-300" to="/signup">
                Create an account
              </Link>
            </div>
            <button
              type="button"
              onClick={() => pushToast({ type: 'info', title: 'Forgot password', message: 'Password reset UI placeholder is ready for future integration.' })}
              className="text-sm text-slate-500 underline-offset-4 hover:text-cyan-300 hover:underline"
            >
              Forgot password?
            </button>
          </>
        }
      />
    </div>
  );
}
