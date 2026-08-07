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

  const [isDarkMode, toggleDarkMode] = useToggle(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg animate-pulse">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Mini Job Marketplace</h1>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <div className="flex-1 sm:flex-initial flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 border border-gray-200 dark:border-gray-600">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap">User: </label>
              <select 
                className="bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-white focus:ring-0 py-1 cursor-pointer w-full"
                value={currentUser.id} 
                onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || currentUser)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="dark:bg-gray-800">{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Actions & Users */}
          <section className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Actions</h2>
              </div>
              <button 
                onClick={toggleJobForm} 
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors mb-4 flex justify-center items-center gap-2 ${
                  showJobForm 
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {showJobForm ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    Cancel Post
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Post a New Job
                  </>
                )}
              </button>
              
              {showJobForm && (
                <form onSubmit={handleCreateJob} className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <input 
                      ref={jobTitleRef}
                      placeholder="Job Title" 
                      value={newJobTitle} 
                      onChange={handleJobTitleChange} 
                      required 
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                    {previousJobTitle !== undefined && previousJobTitle !== newJobTitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">Previous: "{previousJobTitle}"</p>
                    )}
                  </div>
                  <textarea 
                    placeholder="Job Description" 
                    value={newJobDesc} 
                    onChange={e => setNewJobDesc(e.target.value)} 
                    required 
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">₱</span>
                    </div>
                    <input 
                      type="number" 
                      placeholder="Budget" 
                      value={newJobBudget || ''} 
                      onChange={e => setNewJobBudget(Number(e.target.value))} 
                      required 
                      min="1"
                      className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors">
                      Submit Job
                    </button>
                    <button type="button" onClick={() => jobTitleRef.current?.focus()} className="px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors" title="Focus Title">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Directory</h2>
              <div className="flex flex-col gap-3">
                {users.map(user => (
                  <UserCard key={user.id} user={user} onSelect={() => setCurrentUser(user)} compact={true} />
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Jobs */}
          <section className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Jobs</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search jobs..." 
                    value={searchJobTerm} 
                    onChange={(e) => setSearchJobTerm(e.target.value)} 
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white transition-shadow"
                  />
                </div>
              </div>
              
              {jobs.filter(j => j.title.toLowerCase().includes(searchJobTerm.toLowerCase()) || j.description.toLowerCase().includes(searchJobTerm.toLowerCase())).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or post a new job.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.filter(j => j.title.toLowerCase().includes(searchJobTerm.toLowerCase()) || j.description.toLowerCase().includes(searchJobTerm.toLowerCase())).map(job => (
                    <div key={job.id} className="flex flex-col h-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                      <JobCard job={job} onApply={handleApplyJob} />
                      
                      {job.clientId === currentUser.id && (
                        <div className="mt-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mx-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Applications ({applications.filter(a => a.jobId === job.id).length})
                          </h4>
                          <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                            {applications.filter(a => a.jobId === job.id).length === 0 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No applications yet.</p>
                            )}
                            {applications.filter(a => a.jobId === job.id).map(app => (
                              <ApplicationCard key={app.id} application={app} onReview={handleReviewApplication} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
