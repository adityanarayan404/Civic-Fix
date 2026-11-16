import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-stone-950/80 backdrop-blur border-b border-stone-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium tracking-[0.3em] uppercase text-stone-900 dark:text-white">
          CivicFix
        </Link>

        <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em]">
          <Link to="/issues" className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
            All Issues
          </Link>

          {user ? (
            <>
              {user.role === 'CITIZEN' && (
                <>
                  <Link to="/my-issues" className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                    My Issues
                  </Link>
                  <Link
                    to="/report"
                    className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-5 py-2 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors uppercase tracking-[0.2em]"
                  >
                    Report Issue
                  </Link>
                </>
              )}
              {user.role === 'EMPLOYEE' && (
                <Link to="/my-tasks" className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                  My Tasks
                </Link>
              )}
              <span className="text-stone-400 normal-case tracking-normal hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="border border-stone-300 dark:border-stone-600 px-5 py-2 text-stone-700 dark:text-stone-300 hover:border-stone-900 hover:text-stone-900 dark:hover:border-white dark:hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-5 py-2 hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors uppercase tracking-[0.2em]"
              >
                Register
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            {dark ? (
              // sun icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              // moon icon
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
