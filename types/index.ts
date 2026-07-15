export enum UserRole {
    Client = "Client",
    Worker = "Worker",
    Admin = "Admin",
}

export enum JobStatus {
    Open = "Open",
    InProgress = "InProgress",
    Completed = "Completed",
    Cancelled = "Cancelled",
}

export enum ApplicationStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Completed = "Completed",
}

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