import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-blue-700 underline">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
