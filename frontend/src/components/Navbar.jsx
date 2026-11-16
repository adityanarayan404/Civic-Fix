import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium tracking-[0.3em] uppercase text-stone-900">
          CivicFix
        </Link>

        <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em]">
          <Link to="/issues" className="text-stone-500 hover:text-stone-900 transition-colors">
            All Issues
          </Link>

          {user ? (
            <>
              <Link to="/my-issues" className="text-stone-500 hover:text-stone-900 transition-colors">
                My Issues
              </Link>
              <Link
                to="/report"
                className="bg-stone-900 text-white px-5 py-2 hover:bg-stone-700 transition-colors uppercase tracking-[0.2em]"
              >
                Report Issue
              </Link>
              <span className="text-stone-400 normal-case tracking-normal hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="border border-stone-300 px-5 py-2 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors uppercase tracking-[0.2em]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-stone-500 hover:text-stone-900 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-stone-900 text-white px-5 py-2 hover:bg-stone-700 transition-colors uppercase tracking-[0.2em]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
