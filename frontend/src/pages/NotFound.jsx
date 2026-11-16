import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400 mb-6">404</p>
      <h1 className="font-serif text-5xl font-medium mb-10">Page not found</h1>
      <Link
        to="/"
        className="border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-xs uppercase tracking-[0.2em] px-8 py-3 hover:border-stone-900 hover:text-stone-900 dark:hover:border-white dark:hover:text-white transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
