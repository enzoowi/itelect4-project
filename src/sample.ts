import { UserRole, ApplicationStatus, JobStatus } from "../types/index";
import type { User, Job, Application, ApiResponse, WorkerProfile, ID, Money } from "../types/index";

const marketplaceName: string = "Campus Task Board";
const version: number = 1;
const isLive: boolean = false;
const nothing: null = null;
const notSet: undefined = undefined;

void nothing;
void notSet;

console.log(`${marketplaceName} v${version} | Live: ${isLive}`);

type JobOrApp = Job | Application;

function describe(item: JobOrApp): string {
    if ("title" in item) {
        return `Task #${item.id}: ${item.title} (${item.status})`;
    }
    return `Application #${item.id} for Task #${item.jobId} (${item.status})`;
}

const sampleJob: Job = {
    id: 501,
    title: "Buy Snacks from Canteen",
    description: "Get a pandesal and a bottled water during break.",
    budget: 40,
    clientId: 1,
    status: JobStatus.Open,
};

const sampleApp: Application = {
    id: 601,
    jobId: 501,
    workerId: 3,
    coverLetter: "I walk past the canteen every morning.",
    status: ApplicationStatus.Pending,
};

console.log(describe(sampleJob));
console.log(describe(sampleApp));

function getFirst<T>(arr: T[]): T | undefined {
    return arr[0];
}

const tasks: string[] = ["cafeteria-errand", "print-notes", "math-tutoring"];
console.log("First task:", getFirst(tasks));

function findByEmail(users: User[], email: string): ApiResponse<User> {
    const found = users.find(u => u.email === email);
    if (found !== undefined) {
        return { success: true, message: "Student found.", data: found };
    }
    return { success: false, message: "Student not found.", data: null };
}

const sampleUsers: User[] = [
    { id: 1, name: "Brian Miranda", email: "brian@school.edu", role: UserRole.Client, isActive: true },
    { id: 3, name: "Carlo Reyes", email: "carlo@school.edu", role: UserRole.Worker, isActive: true },
];

const searchResult = findByEmail(sampleUsers, "carlo@school.edu");
console.log("findByEmail:", searchResult);

type DraftJob = Partial<Job>;
const draft: DraftJob = { title: "Photocopy Reviewer", budget: 25 };
console.log("Partial<Job>:", draft);

type JobSummary = Pick<Job, "id" | "title" | "status">;
const summary: JobSummary = { id: 501, title: "Buy Snacks from Canteen", status: JobStatus.Open };
console.log("Pick<Job>:", summary);

type PublicJob = Omit<Job, "clientId">;
const publicJob: PublicJob = {
    id: 501,
    title: "Buy Snacks from Canteen",
    description: "Get a pandesal and a bottled water during break.",
    budget: 40,
    status: JobStatus.Open,
};
console.log("Omit<Job>:", publicJob);

const roleEmails: Record<UserRole, string> = {
    [UserRole.Client]: "student-client@school.edu",
    [UserRole.Worker]: "student-worker@school.edu",
    [UserRole.Admin]: "adviser@school.edu",
};
console.log("Record<UserRole, string>:", roleEmails);

const workerUser: User = sampleUsers[1] ?? sampleUsers[0]!;
const workerProfile: WorkerProfile = {
    ...workerUser,
    skills: ["Tutoring", "Errands", "Printing"],
    hourlyRate: 50 as Money,
};
console.log("WorkerProfile:", workerProfile);

function processValue(val: string | number | Date): string {
    if (typeof val === "string") return `String: ${val}`;
    if (typeof val === "number") return `Number: ${val.toFixed(2)}`;
    if (val instanceof Date) return `Date: ${val.toDateString()}`;
    return "Unknown";
}

console.log(processValue("cafeteria errand"));
console.log(processValue(75));
console.log(processValue(new Date("2026-01-15")));

let flexible: any = "pending task";
flexible = 50;
flexible = { task: "buy lunch", floor: 2 };
console.log("any:", flexible);

const raw: unknown = "₱50";
if (typeof raw === "string") {
    console.log("unknown:", raw.toUpperCase());
}

function getStatusLabel(s: ApplicationStatus): string {
    switch (s) {
        case ApplicationStatus.Pending: return "Pending";
        case ApplicationStatus.Approved: return "Approved";
        case ApplicationStatus.Rejected: return "Rejected";
        case ApplicationStatus.Completed: return "Completed";
        default: {
            const _check: never = s;
            throw new Error(`Unhandled: ${String(_check)}`);
        }
    }
}

console.log("statusLabel:", getStatusLabel(ApplicationStatus.Approved));

const jobId: ID = 501;
const budget: Money = 40;
console.log(`Task ${jobId} budget: ₱${budget}`);

type GetFirstReturn = ReturnType<typeof getFirst<string>>;
const result: GetFirstReturn = getFirst(["errand", "tutoring"]);
console.log("ReturnType result:", result);