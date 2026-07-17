import { UserRole, JobStatus, ApplicationStatus } from "./types/index.ts";
import type { User, Job, Application, WorkerProfile, ApiResponse, ID, Money, StringOrNumber } from "./types/index.ts";

const users: User[] = [
    { id: 1, name: "Brian Miranda", email: "brian@school.edu", role: UserRole.Client, isActive: true },
    { id: 2, name: "Maria Santos", email: "maria@school.edu", role: UserRole.Client, isActive: true },
    { id: 3, name: "Carlo Reyes", email: "carlo@school.edu", role: UserRole.Worker, isActive: true },
    { id: 4, name: "Diane Lim", email: "diane@school.edu", role: UserRole.Worker, isActive: true },
    { id: 5, name: "Mr. Dela Cruz", email: "adelacruz@school.edu", role: UserRole.Admin, isActive: true },
];

const jobs: Job[] = [
    { id: 101, title: "Cafeteria Errand", description: "Buy a hotdog sandwich and a juice from the canteen.", budget: 50, clientId: 1, status: JobStatus.Open },
    { id: 102, title: "Print Assignment", description: "Print 3 pages of my research paper at the library.", budget: 30, clientId: 1, status: JobStatus.Open },
    { id: 103, title: "Math Tutoring", description: "Help me review for the calculus long exam on Friday.", budget: 150, clientId: 2, status: JobStatus.InProgress },
];

const applications: Application[] = [
    { id: 201, jobId: 101, workerId: 3, coverLetter: "I pass by the canteen every break time.", status: ApplicationStatus.Pending },
    { id: 202, jobId: 101, workerId: 4, coverLetter: "I can get your order during lunch break.", status: ApplicationStatus.Pending },
    { id: 203, jobId: 103, workerId: 3, coverLetter: "I got a 97 in Calculus last semester.", status: ApplicationStatus.Approved },
];

let nextJobId: ID = 200;
let nextAppId: ID = 300;

function getById<T extends { id: number }>(list: T[], id: number): ApiResponse<T> {
    const item = list.find(x => x.id === id);
    if (item !== undefined) {
        return { success: true, message: "Found.", data: item };
    }
    return { success: false, message: "Not found.", data: null };
}

function getFirst<T>(list: T[]): T | undefined {
    return list[0];
}

function formatId(value: StringOrNumber): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return `#${value}`;
}

function formatBudget(value: StringOrNumber): string {
    if (typeof value === "number") {
        return `₱${value.toLocaleString()}`;
    }
    return `₱${value}`;
}

function handleInput(input: unknown): string {
    if (typeof input === "string") return `String: ${input}`;
    if (typeof input === "number") return `Number: ${input}`;
    if (typeof input === "boolean") return `Boolean: ${input}`;
    if (input instanceof Date) return `Date: ${input.toDateString()}`;
    return "Unknown type";
}

function throwError(message: string): never {
    throw new Error(message);
}

function createJob(title: string, description: string, budget: Money, clientId: ID): ApiResponse<Job> {
    const client = getById(users, clientId);
    if (client.data === null || client.data.role !== UserRole.Client) {
        return { success: false, message: "Client not found.", data: null };
    }
    nextJobId += 1;
    const job: Job = { id: nextJobId, title, description, budget, clientId, status: JobStatus.Open };
    jobs.push(job);
    return { success: true, message: "Job posted.", data: job };
}

function updateJob(jobId: ID, updates: Partial<Job>): ApiResponse<Job> {
    const index = jobs.findIndex(j => j.id === jobId);
    if (index === -1) return { success: false, message: "Job not found.", data: null };
    const existing = jobs[index];
    if (existing === undefined) return { success: false, message: "Job not found.", data: null };
    const updated: Job = { ...existing, ...updates, id: existing.id };
    jobs[index] = updated;
    return { success: true, message: "Job updated.", data: updated };
}

function getJobsByClient(clientId: ID): Job[] {
    return jobs.filter(j => j.clientId === clientId);
}

function applyToJob(jobId: ID, workerId: ID, coverLetter: string): ApiResponse<Application> {
    const job = getById(jobs, jobId);
    if (job.data === null || job.data.status !== JobStatus.Open) {
        return { success: false, message: "Job is not open.", data: null };
    }
    const worker = getById(users, workerId);
    if (worker.data === null || worker.data.role !== UserRole.Worker) {
        return { success: false, message: "Worker not found.", data: null };
    }
    nextAppId += 1;
    const app: Application = { id: nextAppId, jobId, workerId, coverLetter, status: ApplicationStatus.Pending };
    applications.push(app);
    return { success: true, message: "Application submitted.", data: app };
}

function approveApplication(appId: ID, adminId: ID): ApiResponse<Application> {
    return changeStatus(appId, adminId, ApplicationStatus.Approved);
}

function rejectApplication(appId: ID, adminId: ID): ApiResponse<Application> {
    return changeStatus(appId, adminId, ApplicationStatus.Rejected);
}

function completeApplication(appId: ID, adminId: ID): ApiResponse<Application> {
    const result = changeStatus(appId, adminId, ApplicationStatus.Completed);
    if (result.data !== null) {
        updateJob(result.data.jobId, { status: JobStatus.Completed });
    }
    return result;
}

function changeStatus(appId: ID, adminId: ID, newStatus: ApplicationStatus): ApiResponse<Application> {
    const admin = getById(users, adminId);
    if (admin.data === null || admin.data.role !== UserRole.Admin) {
        return { success: false, message: "Admin not found.", data: null };
    }
    const index = applications.findIndex(a => a.id === appId);
    if (index === -1) return { success: false, message: "Application not found.", data: null };
    const existing = applications[index];
    if (existing === undefined) return { success: false, message: "Application not found.", data: null };
    const updated: Application = { ...existing, status: newStatus };
    applications[index] = updated;
    return { success: true, message: `Status changed to ${newStatus}.`, data: updated };
}

function getApplicationsForJob(jobId: ID): Application[] {
    return applications.filter(a => a.jobId === jobId);
}

function getWorkerApplications(workerId: ID): Application[] {
    return applications.filter(a => a.workerId === workerId);
}

function getPublicProfile(user: User): Omit<User, "email"> {
    const { email: _email, ...rest } = user;
    return rest;
}

function getContactInfo(user: User): Pick<User, "name" | "email"> {
    return { name: user.name, email: user.email };
}

function countUsersByRole(): Record<UserRole, number> {
    const counts: Record<UserRole, number> = {
        [UserRole.Client]: 0,
        [UserRole.Worker]: 0,
        [UserRole.Admin]: 0,
    };
    for (const user of users) {
        counts[user.role] += 1;
    }
    return counts;
}

type RoleCounts = ReturnType<typeof countUsersByRole>;

console.log("=== All Posted Tasks ===");
for (const job of jobs) {
    console.log(`${formatId(job.id)} - ${job.title} | Budget: ${formatBudget(job.budget)} | Status: ${job.status}`);
}

console.log("\n=== Apply to Task ===");
const applyResult = applyToJob(102, 4, "I always go to the library after my 9am class.");
console.log(applyResult.message, applyResult.data);

console.log("\n=== Approve Application ===");
const approveResult = approveApplication(201, 5);
console.log(approveResult.message, approveResult.data);

console.log("\n=== Reject Application ===");
const rejectResult = rejectApplication(202, 5);
console.log(rejectResult.message, rejectResult.data);

console.log("\n=== Complete Application ===");
const completeResult = completeApplication(203, 5);
console.log(completeResult.message, completeResult.data);

console.log("\n=== Update Task ===");
const updateResult = updateJob(101, { title: "Canteen Errand", budget: 55 });
console.log(updateResult.message, updateResult.data);

console.log("\n=== Generic Functions ===");
const foundUser = getById(users, 3);
console.log("getById user 3:", foundUser.data);

const foundJob = getById(jobs, 999);
console.log("getById job 999:", foundJob.message);

const firstJob = getFirst(jobs);
console.log("getFirst job:", firstJob);

console.log("\n=== Utility Types ===");
const carlo = users[2];
if (carlo !== undefined) {
    console.log("Omit<User, email>:", getPublicProfile(carlo));
    console.log("Pick<User, name|email>:", getContactInfo(carlo));
}

const roleCounts: RoleCounts = countUsersByRole();
console.log("Record<UserRole, number>:", roleCounts);

const partialUpdate: Partial<Job> = { budget: 60 };
console.log("Partial<Job>:", partialUpdate);

console.log("\n=== Enum Usage ===");
console.log("UserRole values:", Object.values(UserRole));
console.log("JobStatus values:", Object.values(JobStatus));
console.log("ApplicationStatus values:", Object.values(ApplicationStatus));

console.log("\n=== Type Narrowing (typeof) ===");
console.log(formatId(101));
console.log(formatId("task-007"));
console.log(formatBudget(50));
console.log(formatBudget("30"));

console.log("\n=== Type Narrowing (instanceof) ===");
console.log(handleInput("buy lunch"));
console.log(handleInput(75));
console.log(handleInput(true));
console.log(handleInput(new Date()));

console.log("\n=== Special Types ===");

const rawData: any = { task: "print notes", pages: 5 };
console.log("any:", rawData);

const externalInput: unknown = "150";
if (typeof externalInput === "string") {
    console.log("unknown narrowed:", formatBudget(parseFloat(externalInput)));
}

try {
    throwError("This function never returns normally.");
} catch (e) {
    console.log("never caught:", (e as Error).message);
}

console.log("\n=== Intersection Type (WorkerProfile) ===");
const carloProfile: WorkerProfile = {
    ...(users[2] ?? throwError("User not found")),
    skills: ["Tutoring", "Errands", "Printing"],
    hourlyRate: 50,
};
console.log("WorkerProfile:", carloProfile);

console.log("\n=== Post New Task ===");
const newJob = createJob("Borrow Notes", "Lend me your Eng 2 notes for the weekend.", 20, 1);
console.log(newJob.message, newJob.data);

console.log("\n=== Tasks by Client ===");
console.log(getJobsByClient(1));

console.log("\n=== Worker Applications ===");
console.log(getWorkerApplications(3));

console.log("\n=== Applications for Task 101 ===");
console.log(getApplicationsForJob(101));