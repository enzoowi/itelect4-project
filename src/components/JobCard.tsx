import React from 'react';
import type { Job } from '../types/index';

interface JobCardProps {
    job: Job;
    onApply: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
    return (
        <div className="card job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>Budget: ${job.budget}</p>
            <p>Status: {job.status}</p>
            <button onClick={() => onApply(job.id)}>Apply</button>
        </div>
    );
};

export default JobCard;
