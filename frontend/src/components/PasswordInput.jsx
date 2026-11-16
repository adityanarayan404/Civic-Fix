import { useState } from 'react';

function PasswordInput({ value, onChange, minLength }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        minLength={minLength}
        className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md px-4 py-2.5 pr-12 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-400 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
      >
        {show ? (
          // open eye = password is visible
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          // crossed eye = password is hidden
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
