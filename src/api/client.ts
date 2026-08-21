import type { User, Job, Application, NewJob, NewApplication } from '../types/index';

const API_BASE = 'http://localhost:3001';

export const apiClient = {
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  
  getJobs: async (): Promise<Job[]> => {
    const res = await fetch(`${API_BASE}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },
  
  getJobById: async (id: string | number): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  },
  
  createJob: async (job: NewJob): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  getApplications: async (): Promise<Application[]> => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },
  
  createApplication: async (app: NewApplication): Promise<Application> => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(app),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },
  
  updateApplicationStatus: async (id: string | number, status: string): Promise<Application> => {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update application');
    return res.json();
  }
};
