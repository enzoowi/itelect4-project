
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
        Welcome to Mini Job Marketplace
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
        The easiest way to find and post small jobs on campus. Connect with peers to get things done, from grabbing lunch to printing documents.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/marketplace" 
          className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Browse Jobs
        </Link>
        <Link 
          to="/login" 
          className="px-8 py-3 rounded-lg bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
        >
          Login to Post
        </Link>
      </div>
    </div>
  );
}
