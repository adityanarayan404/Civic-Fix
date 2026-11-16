import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import PasswordInput from './PasswordInput';

const roles = [
  { value: 'CITIZEN', label: 'Citizen' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'ADMIN', label: 'Admin' }
];

function LoginForm({ autoFocus = false }) {
  const [role, setRole] = useState('CITIZEN');
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

      if (data.user.role !== role) {
        setError(
          `This account is registered as ${data.user.role.toLowerCase()}. Switch to the ${data.user.role.toLowerCase()} tab to login.`
        );
        return;
      }

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
      {/* role tabs */}
      <div className="flex bg-stone-100 dark:bg-stone-800 rounded-md p-1 mb-6">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={`flex-1 py-2 text-sm rounded transition-colors ${
              role === r.value
                ? 'bg-white dark:bg-stone-950 shadow-sm font-medium text-stone-900 dark:text-white'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 text-sm px-4 py-3 mb-5 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus={autoFocus}
            placeholder="you@example.com"
            className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md px-4 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Password</label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-medium rounded-md py-3 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : `Login as ${roles.find((r) => r.value === role).label}`}
        </button>
      </form>

      {role === 'CITIZEN' && (
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-stone-900 dark:text-white font-medium underline underline-offset-4 hover:text-stone-600 dark:hover:text-stone-300">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}

export default LoginForm;
