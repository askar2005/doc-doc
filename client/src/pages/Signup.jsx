import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';

export default function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const pushToast = useUiStore((state) => state.pushToast);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    weight: '',
    skinGoals: '',
    hairGoals: ''
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await signup({
        ...form,
        age: form.age ? Number(form.age) : null,
        weight: form.weight ? Number(form.weight) : null
      });
      pushToast({ type: 'success', title: 'Account created', message: 'Your wellness journey is ready.' });
      navigate('/dashboard');
    } catch (signupError) {
      pushToast({
        type: 'error',
        title: 'Signup failed',
        message: signupError.response?.data?.message || signupError.message || 'Please check your details'
      });
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-[#0B0F1A]/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50';

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <AuthForm
        title="Create your account"
        subtitle="Set your goals and start tracking skin and hair routines."
        onSubmit={submit}
        submitLabel="Signup"
        error={error}
        loading={loading}
        footerText="Already have an account?"
        footerLink="/login"
        fields={
          <>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
            <input className={inputClass} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" />
              <input className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Gender" />
            </div>
            <input className={inputClass} value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="Weight" />
            <textarea className={inputClass} rows="3" value={form.skinGoals} onChange={(e) => setForm({ ...form, skinGoals: e.target.value })} placeholder="Skin goals" />
            <textarea className={inputClass} rows="3" value={form.hairGoals} onChange={(e) => setForm({ ...form, hairGoals: e.target.value })} placeholder="Hair goals" />
          </>
        }
      />
    </div>
  );
}
