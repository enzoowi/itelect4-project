import React from 'react';
import { Link } from 'react-router';
import type { Job } from '../types/index';

interface JobCardProps {
    job: Job;
    onApply: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        <Link to={`/jobs/${job.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {job.title}
                        </Link>
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {job.status}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{job.description}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Budget: <span className="font-semibold text-gray-900 dark:text-white ml-1">₱{job.budget}</span>
                </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex gap-2 mt-auto">
                <Link 
                    to={`/jobs/${job.id}`}
                    className="flex-1 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-center"
                >
                    Details
                </Link>
                <button 
                    onClick={() => onApply(job.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobCard;
