
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md"
      >
        Go Back Home
      </Link>
    </div>
  );
}
