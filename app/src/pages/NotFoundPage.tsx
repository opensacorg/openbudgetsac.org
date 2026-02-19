import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}
