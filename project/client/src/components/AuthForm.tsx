import { FormEvent, useState } from 'react';

interface Props {
  mode: 'login' | 'register';
  onSubmit: (payload: { email: string; password: string; displayName?: string }) => Promise<void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ email, password, displayName });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-8 shadow-soft">
      {mode === 'register' ? (
        <input
          className="w-full rounded-2xl border px-4 py-3"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      ) : null}

      <input
        className="w-full rounded-2xl border px-4 py-3"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded-2xl border px-4 py-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <button className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700" disabled={loading}>
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
}
