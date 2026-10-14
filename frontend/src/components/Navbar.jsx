import { Link } from 'react-router';

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        CivicFix
      </Link>
      <div className="flex gap-6">
        <Link to="/issues">Issues</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
