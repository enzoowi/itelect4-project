import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import UserCard from '../components/UserCard'
import JobCard from '../components/JobCard'
import ApplicationCard from '../components/ApplicationCard'
import type { User } from '../types/index'
import { JobStatus, ApplicationStatus } from '../types/index'
import usePrevious from '../hooks/usePrevious'
import { apiClient } from '../api/client'
import { useUiStore } from '../store/uiStore'

export default function Marketplace() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const { showJobForm, toggleJobForm, searchTerm, setSearchTerm } = useUiStore();

  const [newJobTitle, setNewJobTitle] = useState<string>("");
  const [newJobDesc, setNewJobDesc] = useState<string>("");
  const [newJobBudget, setNewJobBudget] = useState<number>(0);

  const jobTitleRef = useRef<HTMLInputElement>(null);
  const previousJobTitle = usePrevious(newJobTitle);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: apiClient.getUsers
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: apiClient.getJobs
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: apiClient.getApplications
  });

  const createJobMutation = useMutation({
    mutationFn: apiClient.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setNewJobTitle("");
      setNewJobDesc("");
      setNewJobBudget(0);
      toggleJobForm();
    }
  });

  const createApplicationMutation = useMutation({
    mutationFn: apiClient.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });

  const updateApplicationMutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number, status: string }) => apiClient.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });

  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(users[0]);
    }
  }, [users, currentUser]);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewJobTitle(e.target.value);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    createJobMutation.mutate({
      title: newJobTitle,
      description: newJobDesc,
      budget: newJobBudget,
      clientId: currentUser.id,
      status: JobStatus.Open
    });
  };

  const handleApplyJob = (jobId: string | number) => {
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

    createApplicationMutation.mutate({
      jobId,
      workerId: currentUser.id,
      coverLetter,
      status: ApplicationStatus.Pending
    });
  };

  const handleReviewApplication = (appId: string | number) => {
    if (!currentUser) return;
    const app = applications.find(a => a.id === appId);
    const job = jobs.find(j => j.id === app?.jobId);
    
    if (job?.clientId !== currentUser.id) {
      alert("Only the client who created the job can review its applications.");
      return;
    }

    const action = prompt("Type 'approve' or 'reject' to update application status:");
    if (action === 'approve') {
      updateApplicationMutation.mutate({ id: appId, status: ApplicationStatus.Approved });
    } else if (action === 'reject') {
      updateApplicationMutation.mutate({ id: appId, status: ApplicationStatus.Rejected });
    }
  };

  if (usersLoading || jobsLoading || appsLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg animate-pulse">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-white">Active User Context</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Switch User:</label>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-md py-1 px-2 text-gray-900 dark:text-white"
            value={currentUser.id} 
            onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || currentUser)}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

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
                  <button type="submit" disabled={createJobMutation.isPending} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50">
                    {createJobMutation.isPending ? 'Submitting...' : 'Submit Job'}
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
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white transition-shadow"
                />
              </div>
            </div>
            
            {jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.description.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or post a new job.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.description.toLowerCase().includes(searchTerm.toLowerCase())).map(job => (
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
    </div>
  )
}
