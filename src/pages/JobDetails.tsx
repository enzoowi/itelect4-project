import { useParams, useNavigate, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => apiClient.getJobById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading job details...</div>;
  }

  if (error || !job) {
    return <div className="p-8 text-center text-red-500">Failed to load job details.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
          title="Go back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Details</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Job Reference ID</h3>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">#{job.id}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Title</h3>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Description</h3>
          <p className="text-gray-900 dark:text-white">{job.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Budget</h3>
          <p className="text-gray-900 dark:text-white">₱{job.budget}</p>
        </div>
        <div className="pt-6">
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
