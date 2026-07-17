export const UserRole = {
    Client: "Client",
    Worker: "Worker",
    Admin: "Admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const JobStatus = {
    Open: "Open",
    InProgress: "InProgress",
    Completed: "Completed",
    Cancelled: "Cancelled",
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export const ApplicationStatus = {
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
    Completed: "Completed",
} as const;
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export type ID = number;
export type Money = number;
export type StringOrNumber = string | number;

export interface User {
    id: ID;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export interface Job {
    id: ID;
    title: string;
    description: string;
    budget: Money;
    clientId: ID;
    status: JobStatus;
}

export interface Application {
    id: ID;
    jobId: ID;
    workerId: ID;
    coverLetter: string;
    status: ApplicationStatus;
}

export type WorkerProfile = User & {
    skills: string[];
    hourlyRate: Money;
};

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface Course {
    code: string;
    title: string;
    units: number;
    semester: string;
}

export interface Submission {
    repoUrl: string;
    score?: number;
}