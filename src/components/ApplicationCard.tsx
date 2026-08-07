import React from 'react';
import type { Application } from '../types/index';

interface ApplicationCardProps {
    application: Application;
    onReview: (appId: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onReview }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Application #{application.id}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                    application.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                    {application.status}
                </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded text-sm text-gray-700 dark:text-gray-300 mb-3 border-l-4 border-indigo-400">
                <span className="font-medium block mb-1 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Cover Letter</span>
                "{application.coverLetter}"
            </div>
            <button 
                onClick={() => onReview(application.id)}
                className="w-full sm:w-auto bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-600 dark:border-indigo-400 font-medium py-1.5 px-4 rounded transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
                Review Application
            </button>
        </div>
    );
};

export default ApplicationCard;
