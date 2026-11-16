import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import PasswordInput from './PasswordInput';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-5 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 text-white text-sm font-medium rounded-md py-3 hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-stone-500 mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
