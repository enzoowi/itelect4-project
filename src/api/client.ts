import type {
  Course,
  Category,
  ApiSubmission,
  NewSubmission,
  AuthReply,
  ApiUser,
  Job,
  NewJob,
  Application,
  NewApplication,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite only exposes variables whose name starts with VITE_, and it
// replaces this at BUILD time -- the value that was in .env when
// `npm run build` ran is baked into the bundle. That is why adding it
// in Vercel is not enough on its own: the next deploy is what picks it
// up.

export const API_URL = import.meta.env.VITE_API_URL;

// The same guard db.ts has for MONGODB_URI, for the same reason: a
// sentence now beats every call going to "undefined/api/courses".

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
    "and restart npm run dev.",
  );
}

// Every call goes through here: the host, the JSON header, the token
// when there is one, and the API's own message when it refuses.
async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  // getState(), not the useAuthStore hook -- this is not a component,
  // and it does not need to re-render when the token changes. It only
  // needs whatever the token is at the moment of the call.
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // The exact header requireAuth reads: the word Bearer, one
      // space, then the token. No token in the store means no header
      // at all, which is what the public course routes want.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    // Every refusal this API sends has a message field. Reading it is
    // the difference between "Could not save the submission" and
    // "repoUrl must start with https://github.com/".
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// ---- courses: public. request() sends no token, and none is needed.
export function fetchCourses(): Promise<Course[]> {
  return request<Course[]>("/api/courses");
}

export function fetchCourseByCode(code: string): Promise<Course> {
  return request<Course>(`/api/courses/${code}`);
}

// ---- categories: public reference data
export function fetchCategories(): Promise<Category[]> {
  return request<Category[]>("/api/categories");
}

export function fetchCategoryByCode(code: string): Promise<Category> {
  return request<Category>(`/api/categories/${code}`);
}

// ---- submissions: private. The token goes on automatically.
export function fetchSubmissions(): Promise<ApiSubmission[]> {
  return request<ApiSubmission[]>("/api/submissions");
}

export function createSubmission(
  newSubmission: NewSubmission,
): Promise<ApiSubmission> {
  return request<ApiSubmission>("/api/submissions", {
    method: "POST",
    body: JSON.stringify(newSubmission),
  });
}

// ---- jobs: private. For the user's app
export function fetchJobs(): Promise<Job[]> {
  return request<Job[]>("/api/jobs");
}

export function fetchJobById(id: string | number): Promise<Job> {
  return request<Job>(`/api/jobs/${id}`);
}

export function createJob(newJob: NewJob): Promise<Job> {
  return request<Job>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(newJob),
  });
}

export function updateJob(id: string | number, updates: Partial<NewJob>): Promise<Job> {
  return request<Job>(`/api/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteJob(id: string | number): Promise<void> {
  return request<void>(`/api/jobs/${id}`, {
    method: "DELETE",
  });
}

// ---- auth: the two routes that make a session exist
export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Backward-compatibility wrapper for existing marketplace code using apiClient
export const apiClient = {
  getUsers: async () => [],
  getJobs: fetchJobs,
  getJobById: fetchJobById,
  createJob: createJob,
  getCategories: fetchCategories,
  getApplications: async (): Promise<Application[]> => [],
  createApplication: async (_app: NewApplication): Promise<Application> => {
    throw new Error("Applications not implemented in backend");
  },
  updateApplicationStatus: async (_id: string | number, _status: string): Promise<Application> => {
    throw new Error("Applications not implemented in backend");
  },
};
