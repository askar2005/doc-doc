import { Link } from 'react-router-dom';
import PrimaryButton from '../ui/PrimaryButton';

export default function AuthForm({ title, subtitle, fields, onSubmit, submitLabel, footerLink, footerText, error, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-neon backdrop-blur-xl sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      {fields}
      {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      <PrimaryButton type="submit" className="w-full" disabled={loading}>
        {loading ? 'Please wait...' : submitLabel}
      </PrimaryButton>
      <p className="text-center text-sm leading-6 text-slate-400">
        {footerText}{' '}
        <Link to={footerLink} className="text-cyan-300 hover:text-cyan-200">
          Continue
        </Link>
      </p>
    </form>
  );
}
