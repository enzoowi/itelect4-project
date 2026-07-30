import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import UserCard from './components/UserCard'
import JobCard from './components/JobCard'
import ApplicationCard from './components/ApplicationCard'
import type { User, Job, Application } from './types/index'
import { UserRole, JobStatus, ApplicationStatus } from './types/index'
import useToggle from './hooks/useToggle'
import usePrevious from './hooks/usePrevious'

const initialUsers: User[] = [
  { id: 1, name: "Juan Campus", email: "juan@school.edu", role: UserRole.Client, isActive: true },
  { id: 2, name: "Maria Clara", email: "maria@school.edu", role: UserRole.Client, isActive: true },
  { id: 3, name: "Pedro Penduko", email: "pedro@school.edu", role: UserRole.Admin, isActive: true },
];

const initialJobs: Job[] = [
  { id: 101, title: "Buy lunch from canteen", description: "Please buy me a chicken meal.", budget: 150, clientId: 2, status: JobStatus.Open },
  { id: 102, title: "Print assignment", description: "Need 10 pages printed in color.", budget: 50, clientId: 1, status: JobStatus.Open },
];

const initialApplications: Application[] = [
  { id: 201, jobId: 101, workerId: 1, coverLetter: "I'm heading to the canteen anyway.", status: ApplicationStatus.Pending }
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchJobTerm, setSearchJobTerm] = useState<string>("");

  const [newJobTitle, setNewJobTitle] = useState<string>("");
  const [newJobDesc, setNewJobDesc] = useState<string>("");
  const [newJobBudget, setNewJobBudget] = useState<number>(0);

  const jobTitleRef = useRef<HTMLInputElement>(null);
  const [showJobForm, toggleJobForm] = useToggle(false);
  const previousJobTitle = usePrevious(newJobTitle);

  useEffect(() => {
    setTimeout(() => {
      setUsers(initialUsers);
      setCurrentUser(initialUsers[0]);
      setJobs(initialJobs);
      setApplications(initialApplications);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewJobTitle(e.target.value);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const newJob: Job = {
      id: Date.now(),
      title: newJobTitle,
      description: newJobDesc,
      budget: newJobBudget,
      clientId: currentUser.id,
      status: JobStatus.Open
    };
    setJobs([...jobs, newJob]);
    setNewJobTitle("");
    setNewJobDesc("");
    setNewJobBudget(0);
    toggleJobForm(); // Hide form after creating
  };

  const handleApplyJob = (jobId: number) => {
    if (!currentUser) return;
    const job = jobs.find(j => j.id === jobId);
    if (job?.clientId === currentUser.id) {
      alert("You cannot apply to your own job.");
      return;
    }
    const alreadyApplied = applications.find(a => a.jobId === jobId && a.workerId === currentUser.id);
    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }
    
    const coverLetter = prompt("Enter a cover letter:");
    if (coverLetter === null) return;

    const newApp: Application = {
      id: Date.now(),
      jobId,
      workerId: currentUser.id,
      coverLetter,
      status: ApplicationStatus.Pending
    };
    setApplications([...applications, newApp]);
  };

  const handleReviewApplication = (appId: number) => {
    if (!currentUser) return;
    const app = applications.find(a => a.id === appId);
    const job = jobs.find(j => j.id === app?.jobId);
    
    if (job?.clientId !== currentUser.id) {
      alert("Only the client who created the job can review its applications.");
      return;
    }

    const action = prompt("Type 'approve' or 'reject' to update application status:");
    if (action === 'approve') {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: ApplicationStatus.Approved } : a));
    } else if (action === 'reject') {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: ApplicationStatus.Rejected } : a));
    }
  };

  if (isLoading || !currentUser) {
    return <p>Loading marketplace...</p>;
  }

  return (
    <div className="app">
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <h1>Mini Job Marketplace</h1>
        <div>
          <label>Select Current User: </label>
          <select 
            value={currentUser.id} 
            onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || currentUser)}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </header>

      <main style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
        <section style={{ flex: 1 }}>
          <h2>Actions</h2>
          <button onClick={toggleJobForm} style={{ marginBottom: '1rem' }}>
            {showJobForm ? "Cancel Job Post" : "Post a New Job"}
          </button>
          
          {showJobForm && (
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid #ccc', padding: '1rem' }}>
              <input 
                ref={jobTitleRef}
                placeholder="Job Title" 
                value={newJobTitle} 
                onChange={handleJobTitleChange} 
                required 
              />
              {previousJobTitle !== undefined && previousJobTitle !== newJobTitle && (
                <small style={{ color: 'gray' }}>Previous Title typed: "{previousJobTitle}"</small>
              )}
              <textarea placeholder="Job Description" value={newJobDesc} onChange={e => setNewJobDesc(e.target.value)} required />
              <input type="number" placeholder="Budget" value={newJobBudget} onChange={e => setNewJobBudget(Number(e.target.value))} required />
              <button type="submit">Create Job</button>
              <button type="button" onClick={() => jobTitleRef.current?.focus()}>Focus Title Input</button>
            </form>
          )}
          
          <h2 style={{ marginTop: '2rem' }}>All Users</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {users.map(user => (
              <UserCard key={user.id} user={user} onSelect={() => setCurrentUser(user)} />
            ))}
          </div>
        </section>

        <section style={{ flex: 1 }}>
          <h2>Available Jobs</h2>
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchJobTerm} 
            onChange={(e) => setSearchJobTerm(e.target.value)} 
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.filter(j => j.title.toLowerCase().includes(searchJobTerm.toLowerCase()) || j.description.toLowerCase().includes(searchJobTerm.toLowerCase())).map(job => (
              <div key={job.id} style={{ border: '1px solid #eee', padding: '1rem' }}>
                <JobCard job={job} onApply={handleApplyJob} />
                
                {job.clientId === currentUser.id && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                    <h4>Applications for this job:</h4>
                    {applications.filter(a => a.jobId === job.id).length === 0 && <p>No applications yet.</p>}
                    {applications.filter(a => a.jobId === job.id).map(app => (
                      <ApplicationCard key={app.id} application={app} onReview={handleReviewApplication} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
