export default function PrimaryButton({ className = '', children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-medium text-white shadow-neon transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-base ${className}`}
    >
      {children}
    </button>
  );
}
