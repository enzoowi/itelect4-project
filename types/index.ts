export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    score?: number;
}

export interface Course {
    code: string;
    title: string;
    units: number;
    semester: string;
}

export interface Submission {
    id: number;
    courseId: string;
    studentId: number;
    grade?: number;
}

export type StringOrNumber = string | number;
