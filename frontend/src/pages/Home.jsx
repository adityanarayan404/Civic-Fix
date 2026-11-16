import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const steps = [
  { num: '01', title: 'Report', text: 'Describe the issue with a photo and location.' },
  { num: '02', title: 'Track', text: 'Follow it from verification to assignment.' },
  { num: '03', title: 'Resolved', text: 'See the proof photo once work is done.' }
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* full-page photo backdrop */}
      <img
        src="/hero.jpg"
        alt="Highway winding through golden hills"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative w-full max-w-6xl mx-auto px-6 pt-24 pb-10 grid lg:grid-cols-[1fr_380px] gap-12 items-center">

        {/* left: headline + the three steps */}
        <div className="text-white">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70 mb-5">
            Civic grievance portal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.12] mb-4">
            Report civic issues.
            <br />
            <span className="italic">Watch them get fixed.</span>
          </h1>
          <p className="text-white/80 leading-relaxed max-w-lg mb-10">
            Potholes, broken street lights, garbage, water leaks — your report
            reaches the right people, and you see every step.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4"
              >
                <p className="text-[10px] tracking-[0.25em] text-white/60 mb-1.5">{step.num}</p>
                <h3 className="font-medium mb-1">{step.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* right: login card, visible without scrolling */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {user ? (
            <>
              <h2 className="font-serif text-3xl font-medium mb-2">Welcome back</h2>
              <p className="text-stone-500 text-sm mb-8">
                Logged in as <span className="text-stone-900 font-medium">{user.name}</span>
              </p>
              <Link
                to="/issues"
                className="block w-full bg-stone-900 text-white text-sm font-medium rounded-md py-3 text-center hover:bg-stone-700 transition-colors"
              >
                Browse Issues
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-serif text-3xl font-medium mb-2">User Login</h2>
              <p className="text-stone-500 text-sm mb-6">
                Access your account to report and track issues.
              </p>
              <LoginForm />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
