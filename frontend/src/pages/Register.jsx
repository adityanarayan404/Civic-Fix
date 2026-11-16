import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import PasswordInput from '../components/PasswordInput';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      // Log the new user straight in so they don't have to type it all again
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
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <h1 className="font-serif text-3xl font-medium mb-2 text-center">Create your account</h1>
        <p className="text-stone-500 text-sm mb-8 text-center">
          Join your city's fix-it movement.
        </p>

        {error && (
          <p className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-5 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-stone-300 rounded-md px-4 py-2.5 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

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
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white text-sm font-medium rounded-md py-3 hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-stone-500 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
