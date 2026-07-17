import './App.css'
import UserCard from './components/UserCard'
import JobCard from './components/JobCard'
import ApplicationCard from './components/ApplicationCard'
import type { User, Job, Application } from './types/index'
import { UserRole, JobStatus, ApplicationStatus } from './types/index'

function App() {

  const user: User = {
    id: 1,
    name: "Juan Campus",
    email: "juan.campus@school.edu",
    role: UserRole.Worker,
    isActive: true,
  }

  const job: Job = {
    id: 101,
    title: "Buy lunch from canteen",
    description: "Please buy me a chicken meal from the main canteen. I am stuck in class.",
    budget: 150,
    clientId: 2,
    status: JobStatus.Open
  }

  const application: Application = {
    id: 201,
    jobId: 101,
    workerId: 1,
    coverLetter: "I'm free right now and heading to the canteen anyway. I can drop it off!",
    status: ApplicationStatus.Pending
  }

  return (
    <div className="app">
      <UserCard
        user={user}
        onSelect={(u) => console.log("Selected user:", u)}
      />
      <JobCard 
        job={job} 
        onApply={(jobId) => console.log("Applied to job:", jobId)} 
      />
      <ApplicationCard 
        application={application}
        onReview={(appId) => console.log("Reviewing application:", appId)}
      />
    </div>
  )
}

export default App
