import LoginForm from '../components/LoginForm';

function Login() {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm p-8 fade-up">
        <h1 className="font-serif text-3xl font-medium mb-2 text-center">Welcome back</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 text-center">
          Log in to track and report issues.
        </p>
        <LoginForm autoFocus />
      </div>
    </div>
  );
}

export default Login;
