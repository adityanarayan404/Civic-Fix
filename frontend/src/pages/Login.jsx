import LoginForm from '../components/LoginForm';

function Login() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <h1 className="font-serif text-3xl font-medium mb-2 text-center">Welcome back</h1>
        <p className="text-stone-500 text-sm mb-8 text-center">
          Log in to track and report issues.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
