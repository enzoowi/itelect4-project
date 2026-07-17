import React from 'react';
import type { Application } from '../types/index';

interface ApplicationCardProps {
    application: Application;
    onReview: (appId: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onReview }) => {
    return (
        <div className="card application-card">
            <h3>Application for Job #{application.jobId}</h3>
            <p>Cover Letter: {application.coverLetter}</p>
            <p>Status: {application.status}</p>
            <button onClick={() => onReview(application.id)}>Review</button>
        </div>
    );
};

export default ApplicationCard;
